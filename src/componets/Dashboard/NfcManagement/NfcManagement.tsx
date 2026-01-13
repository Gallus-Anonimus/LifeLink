import { useLanguage } from "../../../context/LanguageContext.tsx";
import { t } from "../../../assets/languages.ts";
import { IconNfc, IconTrash, IconScan, IconDeviceFloppy, IconLink, IconCopy, IconExternalLink } from "@tabler/icons-react";
import { useState, useRef, useEffect, type FormEvent } from "react";
import { registerNfcTag, deregisterNfcTag, fetchApi } from "../../../context/utils.ts";
import { extractEmergencyData, buildSmartPosterUrl } from "../../../utils/hashData.ts";
import type { FetcheData } from "../../../context/types.ts";
import type { MedicalCardData } from "../../MedicalCard/types.ts";

type NfcWindow = Window &
    typeof globalThis & {
        NDEFReader?: {
            new (): {
                scan: (options?: { signal?: AbortSignal }) => Promise<void>;
                write: (message: { records: Array<{ recordType: string; data: string }> }) => Promise<void>;
                addEventListener: (
                    type: "reading" | "readingerror" | "write" | "writeerror",
                    listener: (event: Event) => void,
                    options?: AddEventListenerOptions
                ) => void;
            };
        };
    };

type NfcReadingEvent = Event & {
    serialNumber?: string;
};

export const NfcManagement = () => {
    const { lang } = useLanguage();
    const [nfcTagUid, setNfcTagUid] = useState("");
    const [nfcCode, setNfcCode] = useState("");
    const [isRegistering, setIsRegistering] = useState(false);
    const [isDeregistering, setIsDeregistering] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [isWriting, setIsWriting] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [messageType, setMessageType] = useState<"success" | "error" | null>(null);
    const [, setIsRegistered] = useState<boolean | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        return () => {
            abortControllerRef.current?.abort();
        };
    }, []);

    const showMessage = (text: string, type: "success" | "error") => {
        setMessage(text);
        setMessageType(type);
        setTimeout(() => {
            setMessage(null);
            setMessageType(null);
        }, 5000);
    };

    const handleScan = async () => {
        const { NDEFReader } = window as NfcWindow;

        if (!NDEFReader) {
            showMessage(t("nfc.unsupported", lang), "error");
            return;
        }

        setMessage(null);
        setIsScanning(true);

        try {
            const reader = new NDEFReader();
            const controller = new AbortController();
            abortControllerRef.current = controller;

            reader.addEventListener(
                "reading",
                (event: Event) => {
                    const serial = (event as NfcReadingEvent).serialNumber;
                    if (serial) {
                        setNfcTagUid(serial);
                        setIsScanning(false);
                        showMessage(t("nfc.scan_success", lang), "success");
                    } else {
                        showMessage(t("nfc.no_serial", lang), "error");
                        setIsScanning(false);
                    }
                    controller.abort();
                },
                { once: true }
            );

            reader.addEventListener(
                "readingerror",
                () => {
                    showMessage(t("nfc.read_error", lang), "error");
                    setIsScanning(false);
                    controller.abort();
                },
                { once: true }
            );

            await reader.scan({ signal: controller.signal });
        } catch (error) {
            const err = error as DOMException;
            if (err?.name === "NotAllowedError") {
                showMessage(t("nfc.permission", lang), "error");
            } else {
                showMessage(t("nfc.generic", lang), "error");
            }
            abortControllerRef.current?.abort();
            setIsScanning(false);
        }
    };

    const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        if (!nfcTagUid.trim() || !nfcCode.trim()) {
            showMessage(t("nfc.register.error_fields", lang), "error");
            return;
        }

        setIsRegistering(true);
        setMessage(null);

        try {
            const response = await registerNfcTag(nfcTagUid.trim(), nfcCode.trim());

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                
                if (response.status === 400) {
                    const details = errorData.details || {};
                    const errors = Object.values(details).flat().join(", ");
                    showMessage(errors || t("nfc.register.error_invalid", lang), "error");
                } else if (response.status === 401) {
                    showMessage(t("nfc.register.error_unauthorized", lang), "error");
                } else {
                    showMessage(errorData.details || errorData.message || t("nfc.register.error_generic", lang), "error");
                }
                return;
            }

            const data = await response.json();
            showMessage(data.message || t("nfc.register.success", lang), "success");
            setIsRegistered(true);
            setNfcTagUid("");
            setNfcCode("");
        } catch (err) {
            const errorMessage = err instanceof Error 
                ? err.message 
                : t("nfc.register.error_generic", lang);
            
            if (errorMessage.includes("Failed to fetch") || errorMessage.includes("NetworkError")) {
                showMessage(t("nfc.register.error_network", lang), "error");
            } else {
                showMessage(errorMessage || t("nfc.register.error_generic", lang), "error");
            }
            console.error("Registration error:", err);
        } finally {
            setIsRegistering(false);
        }
    };

    const handleDeregister = async () => {
        if (!confirm(t("nfc.deregister.confirm", lang))) {
            return;
        }

        setIsDeregistering(true);
        setMessage(null);

        try {
            const response = await deregisterNfcTag();

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                
                if (response.status === 401) {
                    showMessage(t("nfc.deregister.error_unauthorized", lang), "error");
                } else if (response.status === 404) {
                    showMessage(errorData.details || t("nfc.deregister.error_not_found", lang), "error");
                } else {
                    showMessage(errorData.details || errorData.message || t("nfc.deregister.error_generic", lang), "error");
                }
                return;
            }

            const data = await response.json();
            showMessage(data.message || t("nfc.deregister.success", lang), "success");
            setIsRegistered(false);
        } catch (err) {
            const errorMessage = err instanceof Error 
                ? err.message 
                : t("nfc.deregister.error_generic", lang);
            
            if (errorMessage.includes("Failed to fetch") || errorMessage.includes("NetworkError")) {
                showMessage(t("nfc.deregister.error_network", lang), "error");
            } else {
                showMessage(errorMessage || t("nfc.deregister.error_generic", lang), "error");
            }
            console.error("Deregistration error:", err);
        } finally {
            setIsDeregistering(false);
        }
    };

    const handleWriteTag = async () => {
        const { NDEFReader } = window as NfcWindow;

        if (!NDEFReader) {
            showMessage(t("nfc.unsupported", lang), "error");
            return;
        }

        setIsWriting(true);
        setMessage(null);

        try {
            // Fetch current patient data
            const jwt = localStorage.getItem('jwt');
            if (!jwt) {
                showMessage(t("nfc.write.error_auth", lang), "error");
                setIsWriting(false);
                return;
            }

            const response = await fetchApi("GET", "/patients/card", {
                headers: {
                    'Authorization': `Bearer ${jwt}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                showMessage(errorData.details || errorData.message || t("nfc.write.error_fetch", lang), "error");
                setIsWriting(false);
                return;
            }

            const apiData: Partial<FetcheData> = await response.json();
            
            // Transform to MedicalCardData format
            const transformMedicalCardData = (data: Partial<FetcheData>): MedicalCardData => {
                const patient = data.patient;
                const card = data.card;
                
                const pacjent = patient && patient.person ? {
                    id_pacjenta: patient.person.personId ?? 0,
                    imie: patient.person.firstName ?? "",
                    nazwisko: patient.person.lastName ?? "",
                    pesel: patient.pesel ?? "",
                    data_urodzenia: patient.dateOfBirth ?? "",
                    telefon: patient.person.phoneNumber ?? "",
                    adres: "",
                    osoba_kontaktowa: patient.contactPerson 
                        ? `${patient.contactPerson.firstName} ${patient.contactPerson.lastName}`.trim()
                        : "",
                    telefon_kontaktowy: patient.contactPerson?.phoneNumber ?? "",
                } : null;

                return {
                    pacjent,
                    alergie: (card?.allergies ?? []).map(a => ({
                        id_alergii: a.allergyId,
                        id_pacjenta: pacjent?.id_pacjenta ?? 0,
                        nazwa: a.name,
                        opis: a.description ?? "",
                    })),
                    choroby_przewlekle: (card?.chronicDiseases ?? []).map(c => ({
                        id_choroby: c.diseaseId,
                        id_pacjenta: pacjent?.id_pacjenta ?? 0,
                        nazwa: c.name,
                        data_rozpoznania: c.diagnosisDate ?? "",
                        uwagi: c.notes ?? "",
                    })),
                    leki: (card?.medicines ?? []).map(m => ({
                        id_leku: m.medicineId,
                        id_pacjenta: pacjent?.id_pacjenta ?? 0,
                        nazwa: m.name,
                        dawka: m.dosage ?? "",
                        czestotliwosc: m.frequency ?? "",
                        od_kiedy: m.startDate ?? "",
                        do_kiedy: m.endDate ?? null,
                    })),
                    szczepienia: [],
                    badania: [],
                    rozpoznania: [],
                    zabiegi: [],
                };
            };

            const medicalCardData = transformMedicalCardData(apiData);
            
            // Extract emergency data
            const emergencyData = extractEmergencyData(
                medicalCardData.pacjent,
                apiData.patient?.bloodType || '',
                medicalCardData.alergie,
                medicalCardData.choroby_przewlekle,
                medicalCardData.leki
            );

            // Build Smart-Poster URL
            const smartPosterUrl = buildSmartPosterUrl(emergencyData);

            // Write to NFC tag
            const reader = new NDEFReader();
            
            await reader.write({
                records: [{
                    recordType: "url",
                    data: smartPosterUrl
                }]
            });

            showMessage(t("nfc.write.success", lang), "success");
        } catch (error) {
            const err = error as DOMException;
            if (err?.name === "NotAllowedError") {
                showMessage(t("nfc.permission", lang), "error");
            } else if (err?.name === "NotSupportedError") {
                showMessage(t("nfc.write.error_not_supported", lang), "error");
            } else {
                showMessage(err?.message || t("nfc.write.error_generic", lang), "error");
            }
            console.error("NFC write error:", error);
        } finally {
            setIsWriting(false);
        }
    };

    const handleGenerateUrl = async () => {
        setIsGenerating(true);
        setGeneratedUrl(null);
        setMessage(null);

        try {
            const jwt = localStorage.getItem('jwt');
            if (!jwt) {
                showMessage(t("nfc.write.error_auth", lang), "error");
                setIsGenerating(false);
                return;
            }

            const response = await fetchApi("GET", "/patients/card", {
                headers: {
                    'Authorization': `Bearer ${jwt}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                showMessage(errorData.details || errorData.message || t("nfc.write.error_fetch", lang), "error");
                setIsGenerating(false);
                return;
            }

            const apiData: Partial<FetcheData> = await response.json();
            
            // Transform to MedicalCardData format
            const transformMedicalCardData = (data: Partial<FetcheData>): MedicalCardData => {
                const patient = data.patient;
                const card = data.card;
                
                const pacjent = patient && patient.person ? {
                    id_pacjenta: patient.person.personId ?? 0,
                    imie: patient.person.firstName ?? "",
                    nazwisko: patient.person.lastName ?? "",
                    pesel: patient.pesel ?? "",
                    data_urodzenia: patient.dateOfBirth ?? "",
                    telefon: patient.person.phoneNumber ?? "",
                    adres: "",
                    osoba_kontaktowa: patient.contactPerson 
                        ? `${patient.contactPerson.firstName} ${patient.contactPerson.lastName}`.trim()
                        : "",
                    telefon_kontaktowy: patient.contactPerson?.phoneNumber ?? "",
                } : null;

                return {
                    pacjent,
                    alergie: (card?.allergies ?? []).map(a => ({
                        id_alergii: a.allergyId,
                        id_pacjenta: pacjent?.id_pacjenta ?? 0,
                        nazwa: a.name,
                        opis: a.description ?? "",
                    })),
                    choroby_przewlekle: (card?.chronicDiseases ?? []).map(c => ({
                        id_choroby: c.diseaseId,
                        id_pacjenta: pacjent?.id_pacjenta ?? 0,
                        nazwa: c.name,
                        data_rozpoznania: c.diagnosisDate ?? "",
                        uwagi: c.notes ?? "",
                    })),
                    leki: (card?.medicines ?? []).map(m => ({
                        id_leku: m.medicineId,
                        id_pacjenta: pacjent?.id_pacjenta ?? 0,
                        nazwa: m.name,
                        dawka: m.dosage ?? "",
                        czestotliwosc: m.frequency ?? "",
                        od_kiedy: m.startDate ?? "",
                        do_kiedy: m.endDate ?? null,
                    })),
                    szczepienia: [],
                    badania: [],
                    rozpoznania: [],
                    zabiegi: [],
                };
            };

            const medicalCardData = transformMedicalCardData(apiData);
            
            // Extract emergency data
            const emergencyData = extractEmergencyData(
                medicalCardData.pacjent,
                apiData.patient?.bloodType || '',
                medicalCardData.alergie,
                medicalCardData.choroby_przewlekle,
                medicalCardData.leki
            );

            // Build Smart-Poster URL
            const smartPosterUrl = buildSmartPosterUrl(emergencyData);
            setGeneratedUrl(smartPosterUrl);
            showMessage(t("nfc.generate.success", lang), "success");
        } catch (error) {
            const err = error as Error;
            showMessage(err?.message || t("nfc.generate.error_generic", lang), "error");
            console.error("URL generation error:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCopyUrl = async () => {
        if (!generatedUrl) return;
        try {
            await navigator.clipboard.writeText(generatedUrl);
            showMessage(t("nfc.generate.copied", lang), "success");
        } catch {
            showMessage(t("nfc.generate.copy_error", lang), "error");
        }
    };

    const handleOpenUrl = () => {
        if (!generatedUrl) return;
        window.open(generatedUrl, '_blank');
    };

    return (
        <div className="col-lg-6">
            <div
                className="card shadow-sm border-0 h-100"
                style={{ borderRadius: "12px" }}
            >
                <div
                    className="card-header bg-primary text-white d-flex justify-content-between align-items-center"
                    style={{
                        borderRadius: "12px 12px 0 0",
                        padding: "1rem 1.25rem",
                    }}
                >
                    <h5 className="mb-0 d-flex align-items-center">
                        <IconNfc size={20} className="me-2" />
                        {t("nfc.management.title", lang)}
                    </h5>
                </div>

                <div className="card-body p-4">
                    {message && (
                        <div
                            className={`alert alert-${messageType === "success" ? "success" : "danger"} alert-dismissible fade show mb-3`}
                            role="alert"
                        >
                            {message}
                            <button
                                type="button"
                                className="btn-close"
                                onClick={() => {
                                    setMessage(null);
                                    setMessageType(null);
                                }}
                                aria-label={t("button.close", lang)}
                            />
                        </div>
                    )}

                    <div className="mb-4">
                        <h6 className="mb-3">{t("nfc.management.register_title", lang)}</h6>
                        <form onSubmit={handleRegister}>
                            <div className="mb-3">
                                <label className="form-label fw-semibold">
                                    {t("nfc.management.tag_uid", lang)}
                                </label>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={nfcTagUid}
                                        onChange={(e) => setNfcTagUid(e.target.value)}
                                        placeholder={t("nfc.management.tag_uid_placeholder", lang)}
                                        disabled={isRegistering || isScanning}
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={handleScan}
                                        disabled={isScanning || isRegistering}
                                    >
                                        {isScanning ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" />
                                                {t("nfc.scanning", lang)}
                                            </>
                                        ) : (
                                            <>
                                                <IconScan size={18} className="me-1" />
                                                {t("nfc.scan", lang)}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-semibold">
                                    {t("nfc.management.code", lang)}
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={nfcCode}
                                    onChange={(e) => setNfcCode(e.target.value)}
                                    placeholder={t("nfc.management.code_placeholder", lang)}
                                    disabled={isRegistering}
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary w-100"
                                disabled={isRegistering || isScanning}
                            >
                                {isRegistering ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" />
                                        {t("nfc.register.registering", lang)}
                                    </>
                                ) : (
                                    t("nfc.register.register", lang)
                                )}
                            </button>
                        </form>
                    </div>

                    <hr className="my-4" />

                    <div className="mb-4">
                        <h6 className="mb-3">{t("nfc.management.write_title", lang)}</h6>
                        <p className="text-muted small mb-3">
                            {t("nfc.write.description", lang)}
                        </p>
                        <button
                            type="button"
                            className="btn btn-success w-100 d-flex align-items-center justify-content-center"
                            onClick={handleWriteTag}
                            disabled={isWriting}
                        >
                            {isWriting ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" />
                                    {t("nfc.write.writing", lang)}
                                </>
                            ) : (
                                <>
                                    <IconDeviceFloppy size={18} className="me-2" />
                                    {t("nfc.write.write", lang)}
                                </>
                            )}
                        </button>
                    </div>

                    <hr className="my-4" />

                    <div className="mb-4">
                        <h6 className="mb-3">{t("nfc.generate.title", lang)}</h6>
                        <p className="text-muted small mb-3">
                            {t("nfc.generate.description", lang)}
                        </p>
                        <button
                            type="button"
                            className="btn btn-info w-100 d-flex align-items-center justify-content-center text-white"
                            onClick={handleGenerateUrl}
                            disabled={isGenerating}
                        >
                            {isGenerating ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" />
                                    {t("nfc.generate.generating", lang)}
                                </>
                            ) : (
                                <>
                                    <IconLink size={18} className="me-2" />
                                    {t("nfc.generate.generate", lang)}
                                </>
                            )}
                        </button>

                        {generatedUrl && (
                            <div className="mt-3">
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        value={generatedUrl}
                                        readOnly
                                        style={{ fontSize: "0.75rem" }}
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary btn-sm"
                                        onClick={handleCopyUrl}
                                        title={t("nfc.generate.copy", lang)}
                                    >
                                        <IconCopy size={16} />
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-outline-primary btn-sm"
                                        onClick={handleOpenUrl}
                                        title={t("nfc.generate.open", lang)}
                                    >
                                        <IconExternalLink size={16} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <hr className="my-4" />

                    <div>
                        <h6 className="mb-3">{t("nfc.management.deregister_title", lang)}</h6>
                        <p className="text-muted small mb-3">
                            {t("nfc.deregister.description", lang)}
                        </p>
                        <button
                            type="button"
                            className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center"
                            onClick={handleDeregister}
                            disabled={isDeregistering}
                        >
                            {isDeregistering ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" />
                                    {t("nfc.deregister.deregistering", lang)}
                                </>
                            ) : (
                                <>
                                    <IconTrash size={18} className="me-2" />
                                    {t("nfc.deregister.deregister", lang)}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

