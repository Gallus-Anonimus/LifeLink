import { useLanguage } from "../../../context/LanguageContext.tsx";
import { t } from "../../../assets/languages.ts";
import { IconUser } from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { fetchApi, changeDate } from "../../../context/utils.ts";

import type { PatientInfoType, PatientInfoProps } from "../../../context/types.ts";
import {Addres} from "./Addres/Addres.tsx";
import Person from "./Parson/Person.tsx"

export const PatientInfo = ({ patient, onDataSaved }: PatientInfoProps) => {
    const [pacient, setPacient] = useState<PatientInfoType>(patient);
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState<string | null>(null);

    const { lang } = useLanguage();

    useEffect(() => {
        setPacient(patient);
    }, [patient]);
    const updatePatient = (patch: Partial<PatientInfoType>) => {
        setPacient(prev => ({ ...prev, ...patch }));
    };

    const updatePerson = (patch: Partial<PatientInfoType["person"]>) => {
        setPacient(prev => ({ ...prev, person: { ...prev.person, ...patch } }));
    };

    const updateContactPerson = (patch: Partial<PatientInfoType["person"]>) => {
        setPacient(prev => ({ 
            ...prev, 
            contactPerson: prev.contactPerson 
                ? { ...prev.contactPerson, ...patch }
                : null
        }));
    };

    const savePatient = async () => {
        setIsSaving(true);
        setSaveMessage(null);
        
        try {
            const payload = {
                email: pacient.email,
                pesel: pacient.pesel,
                dateOfBirth: changeDate(pacient.dateOfBirth) || undefined,
                bloodType: pacient.bloodType,
                person: {
                    firstName: pacient.person.firstName,
                    middleName: pacient.person.middleName || undefined,
                    lastName: pacient.person.lastName,
                    phoneNumber: pacient.person.phoneNumber || undefined,
                    gender: pacient.person.gender,
                    address: {
                        country: pacient.person.address.country || 'POLAND',
                        postalCode: pacient.person.address.postalCode || undefined,
                        city: pacient.person.address.city || undefined,
                        street: pacient.person.address.street || undefined,
                        buildingNumber: pacient.person.address.buildingNumber || undefined,
                    },
                },
                emergencyContact: pacient.contactPerson ? {
                    firstName: pacient.contactPerson.firstName,
                    middleName: pacient.contactPerson.middleName || undefined,
                    lastName: pacient.contactPerson.lastName,
                    phoneNumber: pacient.contactPerson.phoneNumber || undefined,
                    gender: pacient.contactPerson.gender,
                    address: {
                        country: pacient.contactPerson.address.country || 'POLAND',
                        postalCode: pacient.contactPerson.address.postalCode || undefined,
                        city: pacient.contactPerson.address.city || undefined,
                        street: pacient.contactPerson.address.street || undefined,
                        buildingNumber: pacient.contactPerson.address.buildingNumber || undefined,
                    },
                } : undefined,
            };

            const res = await fetchApi("PUT", "/patients/update", {
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                const errorMessage = errorData.details || `Błąd serwera: ${res.status}`;
                setSaveMessage(`Błąd: ${errorMessage}`);
                throw new Error(errorMessage);
            }

            const updated = await res.json();
            if (updated && (updated.person || updated.pesel)) {
                setPacient(updated);
            }
            setSaveMessage("Dane pacjenta zaktualizowane pomyślnie!");
            console.info("Dane pacjenta zaktualizowane.");

            if (onDataSaved) {
                onDataSaved();
            }
        } catch (err) {
            console.error("Nie udało się zaktualizować pacjenta:", err);
            if (!saveMessage) {
                setSaveMessage("Wystąpił błąd podczas zapisywania danych.");
            }
        } finally {
            setIsSaving(false);
        }
    };


    return(
        <div className="row mb-4">
            <div className="col-12">
                <div className="card shadow-sm border-0" style={{ borderRadius: "12px" }}>
                    <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center" style={{ borderRadius: "12px 12px 0 0", padding: "1.25rem" }}>
                        <h3 className="mb-0 d-flex align-items-center">
                            <IconUser size={24} className="me-2" />
                            {t("medicalcard.patient_info", lang)}
                        </h3>
                    </div>
                    <div className="card-body p-4">
                        <div className="row g-4">
                            <div className="col-md-6 bg-body-tertiary p-3 rounded border border-2 border-secondary-subtle">
                                <h5 className="mb-3 bg-body-secondary p-3 rounded border border-2 border-secondary-subtle text-center">{t("medicalcard.personal_data", lang)}</h5>

                                <div className="mb-3">
                                    <label className="form-label fw-semibold">{t("medicalcard.pesel", lang)}</label>
                                    <input
                                        type="text"

                                        className="form-control"
                                        value={pacient.pesel ?? ""}
                                        readOnly
                                        style={{ backgroundColor: "#f8f9fa" }}
                                    />
                                </div>

                                <Person
                                    person={pacient.person}
                                    onChange={updatePerson}
                                />

                                <div className="mb-3">
                                    <label className="form-label fw-semibold">{t("medicalcard.birth_date", lang)}</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={pacient.dateOfBirth ?? ""}
                                        onChange={(e) => updatePatient({ dateOfBirth: e.target.value })}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">{t("medicalcard.bloodtype", lang)}</label>
                                    <select 
                                        className="form-control"
                                        value={pacient.bloodType}
                                        onChange={(e) => updatePatient({ bloodType: e.target.value as PatientInfoType["bloodType"] })}
                                    >
                                        <option value="A+">A+</option>
                                        <option value="A-">A-</option>
                                        <option value="B+">B+</option>
                                        <option value="B-">B-</option>
                                        <option value="AB+">AB+</option>
                                        <option value="AB-">AB-</option>
                                        <option value="O+">O+</option>
                                        <option value="O-">O-</option>
                                    </select>
                                </div>

                            </div>

                            <div className="col-md-6 bg-body-tertiary p-3 rounded border border-2 border-secondary-subtle">
                                <h5 className="text-muted mb-3 fw-semibold text-center">{t("medicalcard.contact_info", lang)}</h5>
                                <div className="mb-3 bg-body-secondary p-3 rounded border border-2 border-secondary-subtle text-center">
                                    <Addres
                                        address={pacient.person.address}
                                        onChange={(addr) => updatePerson({ address: addr })}
                                    />
                                    </div>

                                <div className="mb-3">
                                    <h5 className="text-muted mb-3 fw-semibold text-center">{t("person.info.Contact", lang)}</h5>

                                    <Person
                                        person={pacient.contactPerson}
                                        onChange={updateContactPerson}
                                    />

                                </div>
                            </div>

                        </div>
                        {saveMessage && (
                            <div className={`alert ${saveMessage.includes("Błąd") ? "alert-danger" : "alert-success"} mt-3`} role="alert">
                                {saveMessage}
                            </div>
                        )}
                        <button 
                            type="button" 
                            className="mt-2 btn btn-success" 
                            onClick={savePatient}
                            disabled={isSaving}
                        >
                            {isSaving ? t("button.saving", lang) || "Zapisywanie..." : t("button.save", lang)}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};





