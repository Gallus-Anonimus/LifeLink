import { useParams } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext.tsx";
import { t } from "../../assets/languages.ts";
import { useState, useEffect, useCallback } from "react";
import type { MedicalCardData } from "./types.ts";
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

            const apiData = await response.json();

            const medicalData: MedicalCardData = {
                pacjent: apiData.patient || null,
                alergie: apiData.card?.allergies || [],
                choroby_przewlekle: apiData.card?.chronicDiseases || [],
                badania: apiData.card?.medicalCheckups || [],
                rozpoznania: apiData.card?.medicalDiagnoses || [],
                zabiegi: apiData.card?.medicalProcedures || [],
                leki: apiData.card?.medicines || [],
                szczepienia: apiData.card?.vaccinations || []
            };
            
            setData(medicalData);
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
    console.log(data)
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
