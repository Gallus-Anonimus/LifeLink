import { useParams } from "react-router-dom";
import { useLanguage } from "../../../context/LanguageContext.tsx";
import { t } from "../../../assets/languages.ts";
import { useState, useEffect, useCallback } from "react";
import LoginCode from "../../LoginCode/LoginCode.tsx";
import { fetchApi } from "../../../context/utils.ts";
import type { FetcheData, PatientInfoType } from "../../../context/types.ts";
import { decodeEmergencyData, type EmergencyData } from "../../../utils/hashData.ts";

const ChildrenMode = () => {
    const { lang } = useLanguage();
    const [patient, setPatient] = useState<PatientInfoType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showLoginCode, setShowLoginCode] = useState(false);
    const [isOfflineMode, setIsOfflineMode] = useState(false);
    const { NFC } = useParams<{ NFC: string }>();

    // Convert EmergencyData to minimal PatientInfoType for children mode
    const emergencyDataToPatient = (emergencyData: EmergencyData): PatientInfoType | null => {
        const [firstName, ...lastNameParts] = emergencyData.n.split(' ');
        const lastName = lastNameParts.join(' ') || '';
        
        return {
            person: {
                personId: 0,
                firstName: firstName || '',
                lastName: lastName,
                phoneNumber: '',
                gender: 'MALE',
                address: {
                    street: '',
                    buildingNumber: '',
                    city: '',
                    postalCode: '',
                    country: '',
                },
            },
            contactPerson: emergencyData.e ? {
                personId: 0,
                firstName: '',
                lastName: '',
                phoneNumber: emergencyData.e,
                gender: 'MALE',
                address: {
                    street: '',
                    buildingNumber: '',
                    city: '',
                    postalCode: '',
                    country: '',
                },
            } : null,
            pesel: '',
            bloodType: emergencyData.b as any || 'O+',
            email: '',
            dateOfBirth: '',
        };
    };

    // Check for hash fragment data first (offline mode)
    useEffect(() => {
        const hash = window.location.hash.slice(1);
        if (hash) {
            const emergencyData = decodeEmergencyData(hash);
            if (emergencyData) {
                const hashPatient = emergencyDataToPatient(emergencyData);
                if (hashPatient) {
                    setPatient(hashPatient);
                    setIsOfflineMode(true);
                    setLoading(false);
                    
                    // Optionally fetch fresh data in background if online
                    const jwt = localStorage.getItem('jwt');
                    if (jwt && navigator.onLine) {
                        fetchPatientData(true); // Silent background fetch
                    }
                    return;
                }
            }
        }
        // No hash data, proceed with normal API fetch
        fetchPatientData();
    }, []);

    const fetchPatientData = useCallback(async (silent = false) => {
        try {
            if (!silent) {
                setLoading(true);
                setError(null);
            }

            const jwt = localStorage.getItem('jwt');
            
            if (!jwt) {
                if (!NFC) {
                    if (!silent) {
                        setError("NFC code is required");
                        setLoading(false);
                    }
                    return;
                }
                if (!silent) {
                    setShowLoginCode(true);
                    setLoading(false);
                }
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
                        if (!silent) {
                            setShowLoginCode(true);
                            setLoading(false);
                        }
                    } else {
                        if (!silent) {
                            setError(errorData.details || "Authentication required");
                            setLoading(false);
                        }
                    }
                    return;
                }
                
                if (!silent) {
                    throw new Error(errorData.details || errorData.message || `Failed to fetch: ${response.status}`);
                }
                return;
            }

            const apiData: Partial<FetcheData> = await response.json();
            setPatient(apiData.patient || null);
            setIsOfflineMode(false);
            if (!silent) {
                setShowLoginCode(false);
            }
        } catch (err) {
            if (!silent) {
                setError(err instanceof Error ? err.message : t("medicalcard.error", lang));
            }
        } finally {
            if (!silent) {
                setLoading(false);
            }
        }
    }, [NFC, lang]);

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
                                <div className="d-flex justify-content-center align-items-center gap-2 mb-3">
                                    <h1 
                                        style={{
                                            color: "#FF6B9D",
                                            fontWeight: "bold",
                                            fontSize: "2.5rem",
                                            textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
                                            marginBottom: "0"
                                        }}
                                    >
                                        {t("childrenmode.title", lang)}
                                    </h1>
                                    {isOfflineMode && (
                                        <span className="badge bg-warning text-dark" title="Displaying cached offline data" style={{ fontSize: "0.75rem" }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" className="bi bi-wifi-off me-1" viewBox="0 0 16 16">
                                                <path d="M10.706 3.294A12.6 12.6 0 0 0 8 3C5.259 3 2.723 3.882.663 5.379a.5.5 0 1 0 .707.707A11.5 11.5 0 0 1 8 4c.63 0 1.249.05 1.852.148l.854-.854zM8 6c-1.905 0-3.68.56-5.166 1.526a.5.5 0 0 0 .708.708C4.74 8.096 6.32 7.5 8 7.5c.715 0 1.418.09 2.096.26l.771-.772A7.5 7.5 0 0 0 8 6zm2.596 1.404c.18.18.35.38.49.59l.723-.723a7.5 7.5 0 0 0-1.98-.38l-.232.232zM8 9c.5 0 .98.06 1.444.16l-.415.415c-.562.562-1.15.99-1.78 1.344a.5.5 0 1 0 .5.866 6.4 6.4 0 0 0 2.56-1.77l.723-.723A6.5 6.5 0 0 0 8 9zm3.5 1.5c.195 0 .39.03.58.07l-.766.766a5.5 5.5 0 0 0-1.65.33.5.5 0 0 0 .5.866 4.5 4.5 0 0 1 1.23-.531zm-1.5 1.5a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zm-9-11a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zM13 2.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 .5-.5z"/>
                                            </svg>
                                            Offline
                                        </span>
                                    )}
                                </div>
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


















