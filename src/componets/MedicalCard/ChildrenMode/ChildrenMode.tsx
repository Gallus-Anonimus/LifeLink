import { useParams } from "react-router-dom";
import { useLanguage } from "../../../context/LanguageContext.tsx";
import { t } from "../../../assets/languages.ts";
import { useState, useEffect, useCallback } from "react";
import LoginCode from "../../LoginCode/LoginCode.tsx";
import { fetchApi } from "../../../context/utils.ts";
import type { FetcheData, PatientInfoType } from "../../../context/types.ts";

const ChildrenMode = () => {
    const { lang } = useLanguage();
    const [patient, setPatient] = useState<PatientInfoType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showLoginCode, setShowLoginCode] = useState(false);
    const { NFC } = useParams<{ NFC: string }>();

    const fetchPatientData = useCallback(async () => {
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
            setPatient(apiData.patient || null);
            setShowLoginCode(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : t("medicalcard.error", lang));
        } finally {
            setLoading(false);
        }
    }, [NFC, lang]);

    useEffect(() => {
        fetchPatientData();
    }, [fetchPatientData]);

    const handleLoginSuccess = () => {
        setShowLoginCode(false);
        fetchPatientData();
    };

    if (showLoginCode) {
        return <LoginCode NFCcode={NFC} onSuccess={handleLoginSuccess} />;
    }

    if (loading) {
        return (
            <div 
                className="d-flex align-items-center justify-content-center" 
                style={{ 
                    minHeight: "100vh",
                    background: "linear-gradient(135deg, #FF6B9D 0%, #C44569 25%, #F8B500 50%, #FF6B9D 75%, #C44569 100%)",
                    backgroundSize: "400% 400%",
                    animation: "gradient 15s ease infinite"
                }}
            >
                <style>{`
                    @keyframes gradient {
                        0% { background-position: 0% 50%; }
                        50% { background-position: 100% 50%; }
                        100% { background-position: 0% 50%; }
                    }
                `}</style>
                <div className="text-center">
                    <div className="spinner-border text-white" role="status" style={{ width: "3rem", height: "3rem" }}>
                        <span className="visually-hidden">{t("medicalcard.loading", lang)}</span>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div 
                className="d-flex align-items-center justify-content-center" 
                style={{ 
                    minHeight: "100vh",
                    background: "linear-gradient(135deg, #FF6B9D 0%, #C44569 25%, #F8B500 50%, #FF6B9D 75%, #C44569 100%)",
                    backgroundSize: "400% 400%",
                    animation: "gradient 15s ease infinite"
                }}
            >
                <div className="alert alert-danger" role="alert" style={{ maxWidth: "500px", margin: "20px" }}>
                    {error}
                </div>
            </div>
        );
    }

    if (!patient || !patient.person) {
        return (
            <div 
                className="d-flex align-items-center justify-content-center" 
                style={{ 
                    minHeight: "100vh",
                    background: "linear-gradient(135deg, #FF6B9D 0%, #C44569 25%, #F8B500 50%, #FF6B9D 75%, #C44569 100%)",
                    backgroundSize: "400% 400%",
                    animation: "gradient 15s ease infinite"
                }}
            >
                <div className="alert alert-warning" role="alert" style={{ maxWidth: "500px", margin: "20px" }}>
                    {t("medicalcard.no_data", lang) || "No data available"}
                </div>
            </div>
        );
    }

    const { firstName, lastName} = patient.person;
    const  phoneNumber = patient.contactPerson?.phoneNumber;

    return (
        <div 
            style={{ 
                minHeight: "100vh",
                background: "linear-gradient(135deg, #FF6B9D 0%, #C44569 25%, #F8B500 50%, #FF6B9D 75%, #C44569 100%)",
                backgroundSize: "400% 400%",
                animation: "gradient 15s ease infinite",
                padding: "40px 20px"
            }}
        >
            <style>{`
                @keyframes gradient {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .children-card {
                    animation: bounce 2s ease-in-out infinite;
                }
            `}</style>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-8 col-lg-6">
                        <div 
                            className="children-card card shadow-lg border-0"
                            style={{
                                borderRadius: "30px",
                                background: "linear-gradient(135deg, #FFE5F1 0%, #FFF4E6 50%, #E8F5E9 100%)",
                                padding: "40px",
                                border: "5px solid #FF6B9D"
                            }}
                        >
                            <div className="text-center mb-4">
                                <div 
                                    style={{
                                        fontSize: "60px",
                                        marginBottom: "20px"
                                    }}
                                >
                                    👶
                                </div>
                                <h1 
                                    style={{
                                        color: "#FF6B9D",
                                        fontWeight: "bold",
                                        fontSize: "2.5rem",
                                        textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
                                        marginBottom: "30px"
                                    }}
                                >
                                    {t("childrenmode.title", lang)}
                                </h1>
                            </div>

                            <div className="mb-4">
                                <div 
                                    className="mb-3 p-4 rounded"
                                    style={{
                                        background: "linear-gradient(135deg, #FF6B9D, #C44569)",
                                        color: "white",
                                        borderRadius: "20px",
                                        boxShadow: "0 4px 15px rgba(255, 107, 157, 0.3)"
                                    }}
                                >
                                    <div 
                                        style={{
                                            fontSize: "0.9rem",
                                            opacity: 0.9,
                                            marginBottom: "8px",
                                            fontWeight: "600"
                                        }}
                                    >
                                        {t("medicalcard.first_name", lang)}
                                    </div>
                                    <div 
                                        style={{
                                            fontSize: "1.8rem",
                                            fontWeight: "bold"
                                        }}
                                    >
                                        {firstName || "-"}
                                    </div>
                                </div>

                                <div 
                                    className="mb-3 p-4 rounded"
                                    style={{
                                        background: "linear-gradient(135deg, #F8B500, #FFA500)",
                                        color: "white",
                                        borderRadius: "20px",
                                        boxShadow: "0 4px 15px rgba(248, 181, 0, 0.3)"
                                    }}
                                >
                                    <div 
                                        style={{
                                            fontSize: "0.9rem",
                                            opacity: 0.9,
                                            marginBottom: "8px",
                                            fontWeight: "600"
                                        }}
                                    >
                                        {t("medicalcard.last_name", lang)}
                                    </div>
                                    <div 
                                        style={{
                                            fontSize: "1.8rem",
                                            fontWeight: "bold"
                                        }}
                                    >
                                        {lastName || "-"}
                                    </div>
                                </div>

                                <div 
                                    className="p-4 rounded"
                                    style={{
                                        background: "linear-gradient(135deg, #4ECDC4, #44A08D)",
                                        color: "white",
                                        borderRadius: "20px",
                                        boxShadow: "0 4px 15px rgba(78, 205, 196, 0.3)"
                                    }}
                                >
                                    <div 
                                        style={{
                                            fontSize: "0.9rem",
                                            opacity: 0.9,
                                            marginBottom: "8px",
                                            fontWeight: "600"
                                        }}
                                    >
                                        {t("medicalcard.phone", lang)}
                                    </div>
                                    <div 
                                        style={{
                                            fontSize: "1.8rem",
                                            fontWeight: "bold"
                                        }}
                                    >
                                        {phoneNumber || "-"}
                                    </div>
                                </div>
                            </div>

                            <div className="text-center mt-4">
                                <div style={{ fontSize: "40px" }}>
                                    🌈 ⭐ 🎈
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChildrenMode;








