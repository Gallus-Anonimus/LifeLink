import { useParams } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext.tsx";
import { t } from "../../assets/languages.ts";
import { useState, useEffect, useCallback } from "react";
import type { MedicalCardData, Pacjent, Alergia, ChorobaPrzewlekla, Lek } from "./types.ts";
import PatientInfo from "./PatientInfo/PatientInfo.tsx";
import AllergiesList from "./AllergiesList/AllergiesList.tsx";
import ChronicDiseasesList from "./ChronicDiseasesList/ChronicDiseasesList.tsx";
import MedicationsList from "./MedicationsList/MedicationsList.tsx";
import VaccinationsList from "./VaccinationsList/VaccinationsList.tsx";
import ExaminationsList from "./ExaminationsList/ExaminationsList.tsx";
import DiagnosesList from "./DiagnosesList/DiagnosesList.tsx";
import ProceduresList from "./ProceduresList/ProceduresList.tsx";
import LoginCode from "../LoginCode/LoginCode.tsx";
import { fetchApi } from "../../context/utils.ts";
import type {
    FetcheData,
    PatientInfoType,
    Address,
    Allergy,
    ChronicDisease,
    MedicalCheckup,
    Diagnosis,
    Procedure,
    Medication,
    Vaccination,
} from "../../context/types.ts";

const formatAddress = (address?: Address | null): string => {
    if (!address) return "";
    const line1 = [address.street, address.buildingNumber].filter(Boolean).join(" ").trim();
    const line2 = [address.postalCode, address.city].filter(Boolean).join(" ").trim();
    return [line1, line2, address.country].filter(Boolean).join(", ");
};

const mapPacjent = (patient?: PatientInfoType | null): Pacjent | null => {
    if (!patient || !patient.person) {
        return null;
    }
    const { person, contactPerson } = patient;
    return {
        id_pacjenta: person.personId ?? 0,
        imie: person.firstName ?? "",
        nazwisko: person.lastName ?? "",
        pesel: patient.pesel ?? "",
        data_urodzenia: patient.dateOfBirth ?? "",
        telefon: person.phoneNumber ?? "",
        adres: formatAddress(person.address),
        osoba_kontaktowa: contactPerson
            ? [contactPerson.firstName, contactPerson.lastName].filter(Boolean).join(" ").trim()
            : "",
        telefon_kontaktowy: contactPerson?.phoneNumber ?? "",
    };
};

const transformMedicalCardData = (apiData: Partial<FetcheData>): MedicalCardData => {
    const pacjent = mapPacjent(apiData.patient);
    const patientId = pacjent?.id_pacjenta ?? 0;

    const mapAllergies = (items?: Allergy[]) =>
        (items ?? []).map((allergy) => ({
            id_alergii: allergy.allergyId,
            id_pacjenta: patientId,
            nazwa: allergy.name,
            opis: allergy.description ?? "",
        }));

    const mapChronicDiseases = (items?: ChronicDisease[]) =>
        (items ?? []).map((disease) => ({
            id_choroby: disease.diseaseId,
            id_pacjenta: patientId,
            nazwa: disease.name,
            data_rozpoznania: disease.diagnosisDate ?? "",
            uwagi: disease.notes ?? "",
        }));

    const mapMedicines = (items?: Medication[]) =>
        (items ?? []).map((med) => ({
            id_leku: med.medicineId,
            id_pacjenta: patientId,
            nazwa: med.name,
            dawka: med.dosage ?? "",
            czestotliwosc: med.frequency ?? "",
            od_kiedy: med.startDate ?? "",
            do_kiedy: med.endDate ?? null,
        }));

    const mapVaccinations = (items?: Vaccination[]) =>
        (items ?? []).map((vaccination) => ({
            id_szczepienia: vaccination.vaccinationId,
            id_pacjenta: patientId,
            nazwa: vaccination.vaccine?.name ?? "",
            data_szczepienia: vaccination.vaccinationDate ?? "",
            dawka_nr: vaccination.doseNumber ?? 0,
            uwagi: vaccination.notes ?? null,
        }));

    const mapCheckups = (items?: MedicalCheckup[]) =>
        (items ?? []).map((checkup) => ({
            id_badania: checkup.checkupId,
            id_wizyty: checkup.checkupId,
            typ_badania: checkup.checkupDetails || `#${checkup.checkupId}`,
            wynik: checkup.checkupDetails || "-",
            data_badania: checkup.checkupDate ?? "",
            plik_wyniku: null,
        }));

    const mapDiagnoses = (items?: Diagnosis[]) =>
        (items ?? []).map((diagnosis) => ({
            id_rozpoznania: diagnosis.diagnosisId,
            id_wizyty: diagnosis.diagnosisId,
            kod_icd: diagnosis.icdCode ?? "",
            opis: diagnosis.description ?? "",
        }));

    const mapProcedures = (items?: Procedure[]) =>
        (items ?? []).map((procedure) => ({
            id_zabiegu: procedure.procedureId,
            id_wizyty: procedure.procedureId,
            kod_procedury: procedure.cptCode ?? "",
            opis: procedure.procedureDescription ?? "",
            data_zabiegu: procedure.date ?? "",
        }));

    return {
        pacjent,
        alergie: mapAllergies(apiData.card?.allergies),
        choroby_przewlekle: mapChronicDiseases(apiData.card?.chronicDiseases),
        leki: mapMedicines(apiData.card?.medicines),
        szczepienia: mapVaccinations(apiData.card?.vaccinations),
        badania: mapCheckups(apiData.card?.medicalCheckups),
        rozpoznania: mapDiagnoses(apiData.card?.medicalDiagnoses),
        zabiegi: mapProcedures(apiData.card?.medicalProcedures),
    };
};

const MedicalCard = () => {
    const { lang } = useLanguage();
    const [data, setData] = useState<MedicalCardData>()
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showLoginCode, setShowLoginCode] = useState(false);
    const { NFC } = useParams<{ NFC: string }>();

    const fetchMedicalData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const jwt = localStorage.getItem('jwt');
            
            if (!jwt) {
                if (!NFC) {
                    setError("NFC code is required");
                    setLoading(false);
                    return;
                }
                setShowLoginCode(true);
                setLoading(false);
                return;
            }

            const response = await fetchApi("GET", "/patients/card", {
                headers: {
                    'Authorization': `Bearer ${jwt}`
                }
            })
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));

                if (response.status === 401 || response.status === 403){
                    localStorage.removeItem('jwt');
                    if (NFC) {
                        setShowLoginCode(true);
                    } else {
                        setError(errorData.details || "Authentication required");
                    }
                    setLoading(false);
                    return;
                }
                
                throw new Error(errorData.details || errorData.message || `Failed to fetch: ${response.status}`);
            }

            const apiData: Partial<FetcheData> = await response.json();
            setData(transformMedicalCardData(apiData));
            setShowLoginCode(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : t("medicalcard.error", lang));
        } finally {
            setLoading(false);
        }
    }, [NFC, lang]);

    useEffect(() => {
        fetchMedicalData();
    }, [fetchMedicalData]);

    const handleLoginSuccess = () => {
        setShowLoginCode(false);
        fetchMedicalData();
    };

    if (showLoginCode) {
        return <LoginCode NFCcode={NFC} onSuccess={handleLoginSuccess} />;
    }

    if (loading) {
        return (
            <div className="container mt-4">
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">{t("medicalcard.loading", lang)}</span>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-4">
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="container mt-4">
                <div className="alert alert-warning" role="alert">
                    {t("medicalcard.no_data", lang) || "No medical data available"}
                </div>
            </div>
        );
    }

    const { pacjent, badania, rozpoznania, zabiegi, alergie, choroby_przewlekle, leki, szczepienia } = data;
    return (
        <div className="container mt-4">
            <h1 className="mb-4">{t("medicalcard.title", lang)}</h1>

            {pacjent && <PatientInfo pacjent={pacjent} />}
            <AllergiesList alergie={alergie} />
            <ChronicDiseasesList choroby_przewlekle={choroby_przewlekle} />
            <MedicationsList leki={leki} />
            <VaccinationsList szczepienia={szczepienia} />
            <ExaminationsList badania={badania} />
            <DiagnosesList rozpoznania={rozpoznania} />
            <ProceduresList zabiegi={zabiegi} />
        </div>
    );
};

export default MedicalCard;
