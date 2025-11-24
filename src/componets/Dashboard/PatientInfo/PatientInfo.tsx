import { useLanguage } from "../../../context/LanguageContext.tsx";
import { t } from "../../../assets/languages.ts";
import { IconUser } from "@tabler/icons-react";
import { useState } from "react";

import type { PatientInfoType, PatientInfoProps } from "../../../context/types.ts";
import {Addres} from "./Addres/Addres.tsx";
import Person from "./Parson/Person.tsx"

export const PatientInfo = ({ patient }: PatientInfoProps) => {
    const [pacient, setPacient] = useState<PatientInfoType>(patient);

    const { lang } = useLanguage();
    const updatePatient = (patch: Partial<PatientInfoType>) => {
        setPacient(prev => ({ ...prev, ...patch }));
    };

    const updatePerson = (patch: Partial<PatientInfoType["person"]>) => {
        setPacient(prev => ({ ...prev, person: { ...prev.person, ...patch } }));
    };

    const savePatient = async () => {
        const id = (pacient as unknown as { id?: string | number }).id;
        if (id === undefined) {
            console.error("Brak `id` pacjenta — nie można wykonać aktualizacji.");
            return;
        }

        try {
            const res = await fetch(`/api/patients/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(pacient),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(`Błąd serwera: ${res.status} ${text}`);
            }

            const updated = await res.json();
            setPacient(updated);
            console.info("Dane pacjenta zaktualizowane.");
        } catch (err) {
            console.error("Nie udało się zaktualizować pacjenta:", err);
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
                                    <select className="form-control">
                                        <option value="A+" selected={pacient.bloodType== "A+"} >A+</option>
                                        <option value="A-" selected={pacient.bloodType== "A-"}>A-</option>
                                        <option value="B+" selected={pacient.bloodType== "B+"}>B+</option>
                                        <option value="B-" selected={pacient.bloodType== "B-"}>B-</option>
                                        <option value="AB+" selected={pacient.bloodType== "AB+"}>AB+</option>
                                        <option value="AB-" selected={pacient.bloodType== "AB-"}>AB-</option>
                                        <option value="O+" selected={pacient.bloodType== "O+"}>O+</option>
                                        <option value="O-" selected={pacient.bloodType== "O-"}>O-</option>
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
                                        onChange={updatePerson}
                                    />

                                </div>
                            </div>

                        </div>
                        <button type="button" className=" mt-2 btn btn-success" onClick={savePatient}>
                            Zapisz
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};





