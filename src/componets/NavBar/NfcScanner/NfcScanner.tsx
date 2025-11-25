import { useState, useRef, useEffect } from "react";
import { IconNfc } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

import { useLanguage } from "../../../context/LanguageContext.tsx";
import { t } from "../../../assets/languages.ts";
import "./NfcScanner.css";

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

interface NfcScannerProps {
    isOpen: boolean;
    onClose: () => void;
}

const NfcScanner = ({ isOpen, onClose }: NfcScannerProps) => {
    const { lang } = useLanguage();
    const navigate = useNavigate();
    const [isScanning, setIsScanning] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        return () => {
            abortControllerRef.current?.abort();
        };
    }, []);

    useEffect(() => {
        if (!isOpen) {
            abortControllerRef.current?.abort();
            setIsScanning(false);
            setError(null);
        }
    }, [isOpen]);

    const handleScan = async () => {
        const { NDEFReader } = window as NfcWindow;

        if (!NDEFReader) {
            setError(t("nfc.unsupported", lang));
            return;
        }

        setError(null);

        try {
            const reader = new NDEFReader();
            const controller = new AbortController();
            abortControllerRef.current = controller;
            setIsScanning(true);

            reader.addEventListener(
                "reading",
                (event: Event) => {
                    const serial = (event as NfcReadingEvent).serialNumber;
                    if (serial) {
                        onClose();
                        navigate(`/card/${serial}`);
                    } else {
                        setError(t("nfc.no_serial", lang));
                    }
                    controller.abort();
                    setIsScanning(false);
                },
                { once: true }
            );

            reader.addEventListener(
                "readingerror",
                () => {
                    setError(t("nfc.read_error", lang));
                    controller.abort();
                    setIsScanning(false);
                },
                { once: true }
            );

            await reader.scan({ signal: controller.signal });
        } catch (error) {
            const err = error as DOMException;
            if (err?.name === "NotAllowedError") {
                setError(t("nfc.permission", lang));
            } else {
                setError(t("nfc.generic", lang));
            }
            abortControllerRef.current?.abort();
            setIsScanning(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="nfc-modal-overlay" onClick={onClose}>
            <div className="nfc-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">{t("nfc.title", lang)}</h5>
                    <button
                        type="button"
                        className="btn-close"
                        onClick={onClose}
                        aria-label={t("button.cancel", lang)}
                    />
                </div>
                <div className={`nfc-card border shadow-sm ${isScanning ? "is-scanning" : ""}`}>
                    <div className="nfc-card__header">
                        <div className="nfc-card__icon-wrapper" aria-hidden="true">
                            <span className="nfc-card__pulse" />
                            <IconNfc size={28} stroke={1.5} />
                        </div>
                        <div>
                            <p className="nfc-card__title mb-1">{t("nfc.title", lang)}</p>
                            <p className="nfc-card__subtitle mb-0 text-muted">{t("nfc.subtitle", lang)}</p>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="btn btn-primary nfc-card__btn d-flex align-items-center justify-content-center gap-2 w-100"
                        onClick={handleScan}
                        disabled={isScanning}
                        aria-pressed={isScanning}
                        aria-busy={isScanning}
                    >
                        {isScanning && (
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                        )}
                        <IconNfc size={18} stroke={1.5} />
                        <span>{isScanning ? t("nfc.scanning", lang) : t("nfc.scan", lang)}</span>
                    </button>

                    <p className="nfc-card__hint mb-0">
                        {isScanning ? t("nfc.hint_scanning", lang) : t("nfc.hint_ready", lang)}
                    </p>

                    {error && (
                        <div className="nfc-card__error text-danger small mt-2" role="status" aria-live="polite">
                            {error}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NfcScanner;

