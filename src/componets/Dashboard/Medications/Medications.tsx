import { useLanguage } from "../../../context/LanguageContext.tsx";
import { t } from "../../../assets/languages.ts";
import { IconPill, IconPlus, IconTrash} from "@tabler/icons-react";
import {useEffect, useState} from "react";
import { fetchApi} from "../../../context/utils.ts";
import {type Medication, type MedicationsProps} from "../../../context/types.ts"

export const Medications = ({ medications: initialMedications = [] }: MedicationsProps) => {
    const { lang } = useLanguage();
    const [medications, setMedications] = useState<Medication[]>(initialMedications);
    const [showAdd, setShowAdd] = useState(false);
    const [newName, setNewName] = useState("");
    const [newNotes, setNewNotes] = useState("");

    const fetchMedications = async () => {
        try {
            const res = await fetchApi("GET", "/medicines/list");
            if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
            const data = await res.json();
            setMedications(data.items || []);
        } catch (err) {
            console.error("Failed to fetch medications", err);
        }
    };



    const handleAdd = async (e?: React.FormEvent<HTMLFormElement>) => {
        e?.preventDefault();
        const payload = {
            name: newName.trim(),
            notes: newNotes.trim(),
        };
        try {
            const res = await fetchApi("POST", "/medicines/add", {
                body: JSON.stringify(payload),
                headers: { "Content-Type": "application/json" },
            });
            if (res.ok) {
                await fetchMedications();
                setNewName("");
                setNewNotes("");
                setShowAdd(false);
            } else {
                console.error("Add failed", res.status);
            }
        } catch (err) {
            console.error("Add error", err);
        }
    };

    useEffect(() => {
        fetchMedications();
    },[])

    const deleteMedication = async (id: number) => {
        try {
            const res = await fetchApi("DELETE", `/medicines/${id}/delete`);
            if (res.ok) {
                setMedications((prev: Medication[]) => prev.filter((m: Medication) => m.medicineId !== id));
            } else {
                console.error("Delete failed", res.status);
            }
        } catch (err) {
            console.error("Delete error", err);
        }
    };

    return (
        <div className="col-lg-6">
            <div className="card shadow-sm border-0 h-100" style={{ borderRadius: "12px" }}>
                <div className="card-header bg-info text-white d-flex justify-content-between align-items-center" style={{ borderRadius: "12px 12px 0 0", padding: "1rem 1.25rem" }}>
                    <h5 className="mb-0 d-flex align-items-center">
                        <IconPill size={20} className="me-2" />
                        {t("medicalcard.medications", lang)}
                    </h5>
                    <button className="btn btn-sm btn-light d-flex align-items-center" onClick={() => setShowAdd(v => !v)}>
                        <IconPlus size={16} />
                    </button>
                </div>
                <div className="card-body p-3" style={{ maxHeight: "400px", overflowY: "auto" }}>
                    {showAdd && (
                        <form onSubmit={handleAdd} className="border rounded p-3 mb-3" style={{ backgroundColor: "#f0f9ff" }}>
                            <div className="mb-2">
                                <label className="form-label small fw-semibold text-muted mb-1">{t("medicalcard.medication_name", lang)}</label>
                                <input className="form-control form-control-sm" value={newName} onChange={e => setNewName(e.target.value)} required />
                            </div>
                            <div className="mb-2">
                                <label className="form-label small fw-semibold text-muted">{t("medicalcard.medication_notes",lang)}</label>
                                <textarea className="form-control form-control-sm" value={newNotes} onChange={e => setNewNotes(e.target.value)}></textarea>
                            </div>
                            <div className="mt-2 d-flex gap-2">
                                <button type="submit" className="btn btn-sm btn-info text-white">{t("button.save", lang)}</button>
                                <button type="button" className="btn btn-sm btn-light" onClick={() => setShowAdd(false)}>{t("button.cancel", lang)}</button>
                            </div>
                        </form>
                    )}

                    {medications.map((med) => (
                        <div key={med.medicineId} className="border rounded p-3 mb-3" style={{ backgroundColor: "#f0f9ff" }}>
                            <div className="mb-2">
                                <label className="form-label small fw-semibold text-muted mb-1">{t("medicalcard.medication_name", lang)}</label>
                                <input type="text" className="form-control form-control-sm" value={med.medicineName} readOnly />
                            </div>
                            <div className="mb-2">
                                <label className="form-label small fw-semibold text-muted">{t("medicalcard.medication_notes", lang)}</label>
                                <textarea className="form-control form-control-sm" readOnly value={med.notes || ""}></textarea>
                            </div>
                            <div className="d-flex justify-content-end mt-2">
                                <button className="btn btn-sm btn-outline-info d-flex align-items-center" onClick={() => deleteMedication(med.medicineId)}>
                                <IconTrash size={16} className="me-1" />
                                    {t("button.delete", lang)}
                            </button>
                        </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};





