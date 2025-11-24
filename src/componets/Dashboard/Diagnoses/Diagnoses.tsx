import { useLanguage } from "../../../context/LanguageContext.tsx";
import { t } from "../../../assets/languages.ts";
import { IconFileText, IconPlus, IconTrash } from "@tabler/icons-react";
import {useState} from "react";
import {fetchApi} from "../../../context/utils.ts";
import type {DiagnosesEditProps, Diagnosis} from "../../../context/types.ts";


export const Diagnoses = ({ diagnoses }: DiagnosesEditProps) => {
    const { lang } = useLanguage();

    const [allergies, setAllergies] = useState<Diagnosis[]>(diagnoses);
    const [showAdd, setShowAdd] = useState(false);
    const [newName, setNewName] = useState("");
    const [newDesc, setNewDesc] = useState("");

    const handleAdd = async (e?: React.FormEvent) => {
        e?.preventDefault();
        const payload = {
            name: newName.trim(),
            description: newDesc.trim(),
        };
        try {
            const res = await fetchApi("POST", "/diagnoses/add", {
                body: JSON.stringify(payload),
                headers: { "Content-Type": "application/json" },
            });
            if (res.ok) {
                await fetchDiagnoses();
                setNewName("");
                setNewDesc("");
                setShowAdd(false);
            } else {
                console.error("Add failed", res.status);
            }
        } catch (err) {
            console.error("Add error", err);
        }
    };

    const deleteDiagnosis = async (id: number) => {
        try {
            const res = await fetchApi("DELETE", `/diagnoses/${id}/delete`);
            if (res.ok) {
                setAllergies(prev => prev.filter(d => d.diagnosisId !== id));
            } else {
                console.error("Delete failed", res.status);
            }
        } catch (err) {
            console.error("Delete error", err);
        }
    };

    const fetchDiagnoses = async () => {
        try {
            const res = await fetchApi("GET", "/diagnoses/list");
            if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
            const data = await res.json();
            console.log(data.items);
            setAllergies(data.items || []);
        } catch (err) {
            console.error("Failed to fetch diagnoses", err);
        }
    };

    return (
        <div className="col-lg-6">
            <div className="card shadow-sm border-0 h-100" style={{ borderRadius: "12px" }}>
                <div className="card-header text-white d-flex justify-content-between align-items-center" style={{ backgroundColor: "#fd7e14", borderRadius: "12px 12px 0 0", padding: "1rem 1.25rem" }}>
                    <h5 className="mb-0 d-flex align-items-center">
                        <IconFileText size={20} className="me-2" />
                        {t("medicalcard.diagnoses", lang)}
                    </h5>
                    <button className="btn btn-sm btn-light" onClick={() => setShowAdd(!showAdd)}>
                        <IconPlus size={16} />
                    </button>
                </div>
                <div className="card-body p-3" style={{ maxHeight: "400px", overflowY: "auto" }}>
                    {showAdd && (
                        <form onSubmit={handleAdd} className="border rounded p-3 mb-3" style={{ backgroundColor: "#ffe0b2" }}>
                            <div className="mb-2">
                                <label className="form-label small fw-semibold text-muted mb-1">{t("medicalcard.icd_code", lang)}</label>
                                <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-2">
                                <label className="form-label small fw-semibold text-muted mb-1">{t("medicalcard.description", lang)}</label>
                                <textarea
                                    className="form-control form-control-sm"
                                    rows={2}
                                    value={newDesc}
                                    onChange={(e) => setNewDesc(e.target.value)}
                                ></textarea>
                            </div>
                            <button type="submit" className="btn btn-sm btn-warning text-dark">
                                {t("button.add", lang)}
                            </button>
                        </form>
                    )}
                    {allergies.map((diag) => (
                        <div key={diag.diagnosisId} className="border rounded p-3 mb-3" style={{ backgroundColor: "#fff4e6" }}>
                            <div className="mb-2">
                                <label className="form-label small fw-semibold text-muted mb-1">{t("medicalcard.icd_code", lang)}</label>
                                <input type="text" className="form-control form-control-sm" value={diag.icdCode} readOnly />
                            </div>
                            <div className="mb-2">
                                <label className="form-label small fw-semibold text-muted mb-1">{t("medicalcard.description", lang)}</label>
                                <textarea className="form-control form-control-sm" rows={2} value={diag.description} readOnly></textarea>
                            </div>
                            <button className="btn btn-sm btn-outline-warning text-dark d-flex align-items-center" onClick={() => deleteDiagnosis(diag.diagnosisId)}>
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





