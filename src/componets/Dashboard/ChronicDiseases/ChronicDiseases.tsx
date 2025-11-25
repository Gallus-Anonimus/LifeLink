import { useLanguage } from "../../../context/LanguageContext.tsx";
import { t } from "../../../assets/languages.ts";
import { IconHeartbeat, IconPlus, IconTrash } from "@tabler/icons-react";
import {useEffect, useState} from "react";
import {changeDate, fetchApi} from "../../../context/utils.ts";
import type {ChronicDisease , ChronicDiseasesProps} from "../../../context/types.ts";

export const ChronicDiseases = ({ chronicdiseases }: ChronicDiseasesProps) => {
    const { lang } = useLanguage();

    const [chronicDisease, setChronicDisease] = useState<ChronicDisease[]>(chronicdiseases || []);
    const [showAdd, setShowAdd] = useState(false);
    const [newName, setNewName] = useState("");
    const [newDesc, setNewDesc] = useState("");
    const [newDate, setNewDate] = useState("");

    useEffect(() => {
        if (chronicdiseases) setChronicDisease(chronicdiseases);
    }, [chronicdiseases]);
    const handleAdd = async (e?: React.FormEvent) => {
        e?.preventDefault();
        const payload = {
            name: newName.trim(),
            diagnosisDate: changeDate(newDate) || undefined,
            notes: newDesc.trim(),
        };
        try {
            const res = await fetchApi("POST", "/diseases/add", {
                body: JSON.stringify(payload),
                headers: { "Content-Type": "application/json" },
            });
            if (res.ok) {
                await fetchChronicDiseases();
                setNewName("");
                setNewDesc("");
                setNewDate("");
                setShowAdd(false);
            } else {
                console.error("Add failed", res.status);
            }
        } catch (err) {
            console.error("Add error", err);
        }
    };

    const deleteChronicDiseases = async (id: number) => {
        try {
            const res = await fetchApi("DELETE", `/diseases/${id}/delete`);
            if (res.ok) {
                setChronicDisease(prev => prev.filter(a => a.diseaseId !== id));
            } else {
                console.error("Delete failed", res.status);
            }
        } catch (err) {
            console.error("Delete error", err);
        }
    };

    const fetchChronicDiseases = async () => {
        try {
            const res = await fetchApi("GET", "/diseases/list");
            if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
            const data = await res.json();
            setChronicDisease(data.items || []);
        } catch (err) {
            console.error("Failed to fetch diseases", err);
        }
    };

    useEffect(() => {
        fetchChronicDiseases();
    },[]);

    return (
        <div className="col-lg-6">
            <div className="card shadow-sm border-0 h-100" style={{ borderRadius: "12px" }}>
                <div className="card-header bg-warning text-dark d-flex justify-content-between align-items-center" style={{ borderRadius: "12px 12px 0 0", padding: "1rem 1.25rem" }}>
                    <h5 className="mb-0 d-flex align-items-center">
                        <IconHeartbeat size={20} className="me-2" />
                        {t("medicalcard.chronic_diseases", lang)}
                    </h5>
                    <button className="btn btn-sm btn-light" onClick={() => setShowAdd(prev => !prev)}>
                        <IconPlus size={16} />
                    </button>
                </div>
                <div className="card-body p-3" style={{ maxHeight: "400px", overflowY: "auto" }}>
                    {showAdd && (
                        <form className="border rounded p-3 mb-3" onSubmit={handleAdd} style={{ backgroundColor: "#fff" }}>
                            <div className="mb-2">
                                <label className="form-label small fw-semibold text-muted mb-1">{t("medicalcard.disease_name", lang)}</label>
                                <input type="text" className="form-control form-control-sm" value={newName} onChange={e => setNewName(e.target.value)} />
                            </div>
                            <div className="row g-2">
                                <div className="col-6">
                                    <label className="form-label small fw-semibold text-muted mb-1">{t("medicalcard.diagnosis_date", lang)}</label>
                                    <input type="date" className="form-control form-control-sm" value={newDate} onChange={e => setNewDate(e.target.value)} />
                                </div>
                            </div>
                            <div className="mb-2">
                                <label className="form-label small fw-semibold text-muted mb-1">{t("medicalcard.notes", lang)}</label>
                                <textarea className="form-control form-control-sm" rows={2} value={newDesc} onChange={e => setNewDesc(e.target.value)}></textarea>
                            </div>
                            <div className="d-flex gap-2">
                                <button type="submit" className="btn btn-sm btn-warning text-dark">{t("button.save",lang)}</button>
                                <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => { setShowAdd(false); setNewName(""); setNewDesc(""); setNewDate(""); }}>{t("button.cancel",lang)}</button>
                            </div>
                        </form>
                    )}

                    {chronicDisease.map((disease) => (
                        <div key={disease.diseaseId} className="border rounded p-3 mb-3" style={{ backgroundColor: "#fffbf0" }}>
                            <div className="mb-2">
                                <label className="form-label small fw-semibold text-muted mb-1">{t("medicalcard.disease_name", lang)}</label>
                                <input type="text" className="form-control form-control-sm" value={disease.name} readOnly />
                            </div>
                            <div className="row g-2">
                                <div className="col-6">
                                    <label className="form-label small fw-semibold text-muted mb-1">{t("medicalcard.diagnosis_date", lang)}</label>
                                    <input type="date" className="form-control form-control-sm" value={disease.diagnosisDate} readOnly />
                                </div>
                            </div>
                            <div className="mb-2">
                                <label className="form-label small fw-semibold text-muted mb-1">{t("medicalcard.notes", lang)}</label>
                                <textarea className="form-control form-control-sm" rows={2} value={disease.notes} readOnly></textarea>
                            </div>
                            <button className="btn btn-sm btn-outline-warning text-dark d-flex align-items-center" onClick={() => deleteChronicDiseases(disease.diseaseId)}>
                                <IconTrash size={16} className="me-1" />
                                {t("button.delete", lang)}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};





