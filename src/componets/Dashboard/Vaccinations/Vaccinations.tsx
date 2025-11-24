import { useLanguage } from "../../../context/LanguageContext.tsx";
import { t } from "../../../assets/languages.ts";
import { IconShieldCheck, IconPlus, IconTrash } from "@tabler/icons-react";
import { useState, useEffect } from "react";
import {changeDate, fetchApi} from "../../../context/utils.ts";
import type { VaccinationsProps, Vaccination } from "../../../context/types.ts";

export const Vaccinations = ({ vaccinations: initialVaccinations }: VaccinationsProps) => {
    const { lang } = useLanguage();

    const [vaccinations, setVaccinations] = useState<Vaccination[]>(initialVaccinations || []);
    const [showAdd, setShowAdd] = useState(false);
    const [newName, setNewName] = useState("");
    const [newDesc, setNewDesc] = useState("");
    const [newDate, setNewDate] = useState("");
    const [newDose, setNewDose] = useState(1);
    const [newNotes, setNewNotes] = useState("");
    const [newVaccineId, setNewVaccineId] = useState<number | null>(null);
    const [vaccineList, setVaccineList] = useState<Array<{vaccineId: number; name: string}>>([]);

    useEffect(() => {
        setVaccinations(initialVaccinations || []);
        fetchApi("GET","/vaccines/list").then(
            res => res.json()
        ).then(
            data => setVaccineList(data.items || [])
        )
    }, [initialVaccinations]);

    const fetchVaccinations = async () => {
        try {
            const res = await fetchApi("GET", "/vaccinations/list");
            if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
            const data = await res.json();
            setVaccinations(data.items || []);
        } catch (err) {
            console.error("Failed to fetch vaccinations", err);
        }
    };

    const handleAdd = async (e?: React.FormEvent) => {
        e?.preventDefault();
        const payload = {
            name: newName.trim(),
            vaccineId: newVaccineId,
            description: newDesc.trim(),
            vaccinationDate: changeDate(newDate) || null,
            doseNumber: newDose,
            notes: newNotes.trim(),
        };
        try {
            const res = await fetchApi("POST", "/vaccinations/add", {
                body: JSON.stringify(payload),
                headers: { "Content-Type": "application/json" },
            });
            if (res.ok) {
                await fetchVaccinations();
                setNewName("");
                setNewDesc("");
                setNewDate("");
                setNewDose(1);
                setNewNotes("");
                setNewVaccineId(null)
                setShowAdd(false);
            } else {
                console.error("Add failed", res.status);
            }
        } catch (err) {
            console.error("Add error", err);
        }
    };

    const deleteVaccination = async (id: number) => {
        try {
            const res = await fetchApi("DELETE", `/vaccinations/${id}/delete`);
            if (res.ok) {
                setVaccinations(prev => prev.filter(v => v.vaccinationId !== id));
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
                <div className="card-header bg-success text-white d-flex justify-content-between align-items-center" style={{ borderRadius: "12px 12px 0 0", padding: "1rem 1.25rem" }}>
                    <h5 className="mb-0 d-flex align-items-center">
                        <IconShieldCheck size={20} className="me-2" />
                        {t("medicalcard.vaccinations", lang)}
                    </h5>
                    <button className="btn btn-sm btn-light" onClick={() => setShowAdd(s => !s)}>
                        <IconPlus size={16} />
                    </button>
                </div>
                <div className="card-body p-3" style={{ maxHeight: "400px", overflowY: "auto" }}>
                    {showAdd && (
                        <form className="border rounded p-3 mb-3 bg-white" onSubmit={handleAdd}>
                            <div className="row g-2">
                                <div className="col-6">
                                    <label className="form-label small fw-semibold text-muted mb-1">{t("medicalcard.vaccination_name", lang)}</label>
                                    <input type="text" className="form-control form-control-sm" value={newName} onChange={e => setNewName(e.target.value)} />
                                </div>
                                <div className="col-6">
                                    <label className="form-label small fw-semibold text-muted mb-1">{t("medicalcard.description", lang)}</label>
                                    <input type="text" className="form-control form-control-sm" value={newDesc} onChange={e => setNewDesc(e.target.value)} />
                                </div>
                            </div>
                            <div className="row g-2 mt-2">
                                <div className="col-6">
                                    <label className="form-label small fw-semibold text-muted mb-1">{t("medicalcard.vaccination_date", lang)}</label>
                                    <input type="date" className="form-control form-control-sm" value={newDate} onChange={e => setNewDate(e.target.value)} />
                                </div>
                                <div className="col-6">
                                    <label className="form-label small fw-semibold text-muted mb-1">{t("medicalcard.vaccine_type", lang)}</label>
                                    <select className="form-select" value={newVaccineId ?? ""} onChange={e => setNewVaccineId(e.target.value ? Number(e.target.value) : null)} required>
                                        <option value="">{t("medicalcard.select_vaccine", lang) ?? "Wybierz szczepionkę"}</option>
                                        {vaccineList.map(vaccine => (
                                            <option key={vaccine.vaccineId} value={vaccine.vaccineId}>{vaccine.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-4">
                                    <label className="form-label small fw-semibold text-muted mb-1">{t("medicalcard.dose_number", lang)}</label>
                                    <input type="number" min={1} className="form-control form-control-sm" value={newDose} onChange={e => setNewDose(Number(e.target.value) || 1)} />
                                </div>
                                <div className="col-4">
                                    <label className="form-label small fw-semibold text-muted mb-1">{t("medicalcard.notes", lang)}</label>
                                    <input type="text" className="form-control form-control-sm" value={newNotes} onChange={e => setNewNotes(e.target.value)} />
                                </div>
                            </div>
                            <div className="d-flex justify-content-end mt-2">
                                <button type="button" className="btn btn-sm btn-light me-2" onClick={() => { setShowAdd(false); setNewName(""); setNewDesc(""); setNewDate(""); setNewDose(1); setNewNotes(""); }}>
                                    Anuluj
                                </button>
                                <button type="submit" className="btn btn-sm btn-success">
                                    Dodaj
                                </button>
                            </div>
                        </form>
                    )}

                    {vaccinations.map((vacc: Vaccination) => (
                        <div key={vacc.vaccinationId} className="border rounded p-3 mb-3" style={{ backgroundColor: "#f0fdf4" }}>
                            <div className="mb-2">
                                <label className="form-label small fw-semibold text-muted mb-1">{t("medicalcard.vaccination_name", lang)}</label>
                                <input type="text" className="form-control form-control-sm" value={vacc.vaccine.name} readOnly />
                            </div>
                            <div className="row g-2">
                                <div className="col-6">
                                    <label className="form-label small fw-semibold text-muted mb-1">{t("medicalcard.vaccination_date", lang)}</label>
                                    <input type="date" className="form-control form-control-sm" value={vacc.vaccinationDate} readOnly />
                                </div>
                                <div className="col-6">
                                    <label className="form-label small fw-semibold text-muted mb-1">{t("medicalcard.dose_number", lang)}</label>
                                    <input type="number" className="form-control form-control-sm" value={vacc.doseNumber} readOnly />
                                </div>
                            </div>
                            <div className="mb-2">
                                <label className="form-label small fw-semibold text-muted mb-1">{t("medicalcard.notes", lang)}</label>
                                <input type="text" className="form-control form-control-sm" value={vacc.notes || ""} readOnly />
                            </div>
                            <button className="btn btn-sm btn-outline-success d-flex align-items-center" onClick={() => deleteVaccination(vacc.vaccinationId)}>
                                <IconTrash size={16} className="me-1" />
                                Usuń
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};






