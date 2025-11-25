import { useLanguage } from "../../../context/LanguageContext.tsx";
import { t } from "../../../assets/languages.ts";
import { IconNfc, IconTrash, IconScan } from "@tabler/icons-react";
import { useState, useRef, useEffect, type FormEvent } from "react";
import { registerNfcTag, deregisterNfcTag } from "../../../context/utils.ts";

type NfcWindow = Window &
    typeof globalThis & {
        NDEFReader?: {
            new (): {
                scan: (options?: { signal?: AbortSignal }) => Promise<void>;
                addEventListener: (
                    type: "reading" | "readingerror",
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

