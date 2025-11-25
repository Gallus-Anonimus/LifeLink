import { useLanguage } from "../../context/LanguageContext.tsx";
import { t } from "../../assets/languages.ts";
import {useEffect, useState, useCallback} from "react";
import {fetchApi} from "../../context/utils.ts";
import {Spinner} from "react-bootstrap";
import {Navigate} from "react-router-dom";
import { PatientInfo } from "./PatientInfo/PatientInfo.tsx";
import {Allergies} from "./Allergies/Allergies.tsx";
import {ChronicDiseases} from "./ChronicDiseases/ChronicDiseases.tsx";
import {Medications} from "./Medications/Medications.tsx";
import {Vaccinations} from "./Vaccinations/Vaccinations.tsx";
import {MedicalCheckup} from "./MedicalCheckup/MedicalCheckup.tsx";
import {Diagnoses} from "./Diagnoses/Diagnoses.tsx";
import {Procedures} from "./Procedures/Procedures.tsx";
import {NfcManagement} from "./NfcManagement/NfcManagement.tsx";
import type {FetcheData} from "../../context/types.ts";



export const Dashboard = () => {
    const { lang } = useLanguage();
    const [fetchedData, setfetchedData] = useState<FetcheData | null>(null);
    const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

    const fetchPatientData = useCallback(async () => {
        try {
            const res = await fetchApi("GET", "/patients/details");
            if (!res.ok) {
                throw new Error(`Failed to fetch patient data: ${res.status}`);
            }
            const data = await res.json();
            setfetchedData(data);
        } catch (err) {
            console.error("Failed to fetch patient data:", err);
            setfetchedData(null);
        }
    }, []);

    useEffect(() => {
        fetchApi("GET", "/auth/session-status")
            .then(res => res.json())
            .then(data => setLoggedIn(data.active))
            .catch(() => setLoggedIn(false));

        fetchPatientData();
    }, [fetchPatientData]);

    if(loggedIn === null)
        return (
            <div className="d-flex align-items-center justify-content-center py-5 bg-light" style={{ minHeight: "calc(100vh - 140px)" }}>
                <div className="text-center">
                    <Spinner animation="border" role="status" className="mb-3">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                    <p className="text-muted">Loading...</p>
                </div>
            </div>
        );

    if(!loggedIn)
        return <Navigate to="/login"></Navigate>;

    if (fetchedData === null)
        return (
            <div className="d-flex align-items-center justify-content-center py-5 bg-light" style={{ minHeight: "calc(100vh - 140px)" }}>
                <div className="text-center">
                    <Spinner animation="border" role="status" className="mb-3">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                    <p className="text-muted">Loading patient data...</p>
                </div>
            </div>
        );

    if (!fetchedData.patient || !fetchedData.card) {
        return (
            <div className="d-flex align-items-center justify-content-center py-5 bg-light" style={{ minHeight: "calc(100vh - 140px)" }}>
                <div className="text-center">
                    <p className="text-danger">Error: Invalid data structure received</p>
                    <button className="btn btn-primary mt-3" onClick={fetchPatientData}>
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid px-4 py-4" style={{ backgroundColor: "#f5f7fa", minHeight: "100vh" }}>
            <div className="row mb-4">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h1 className="h2 mb-0" style={{ color: "#2c3e50", fontWeight: "600" }}>
                            {t("medicalcard.title", lang)} - {t("medicalcard.patient_info", lang)}
                        </h1>
                    </div>
                </div>
            </div>

            <PatientInfo patient={fetchedData.patient} onDataSaved={fetchPatientData} />

            <div className="row g-4 mb-4">
                <NfcManagement />
            </div>

            <div className="row g-4">
                <Allergies allergies={fetchedData.card?.allergies} />
                <ChronicDiseases chronicdiseases={fetchedData.card?.chronicDiseases}/>
                <Medications medications={fetchedData.card?.medicines} />
                <Vaccinations vaccinations={fetchedData.card?.vaccinations} />
                <MedicalCheckup />
                <Diagnoses diagnoses={fetchedData.card?.medicalDiagnoses} />
                <Procedures procedures={fetchedData.card?.medicalProcedures} />
            </div>
        </div>
    );
};
