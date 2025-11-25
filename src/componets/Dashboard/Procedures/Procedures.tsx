import { useState } from "react";
import { useLanguage } from "../../../context/LanguageContext.tsx";
import { t } from "../../../assets/languages.ts";
import { IconScissors, IconPlus, IconTrash } from "@tabler/icons-react";
import {changeDate, fetchApi, reverseDate} from "../../../context/utils.ts";
import type {Procedure, ProceduresEditProps} from "../../../context/types.ts";


export const Procedures = ({ procedures }: ProceduresEditProps) => {
    const { lang } = useLanguage();
    const mappedProcedures = procedures.map(proc => ({
        ...proc,
        date: (proc as any).procedureDate || proc.date || ''
    }));
    const [proceduresList, setProceduresList] = useState<Procedure[]>(mappedProcedures);
    const [isAdding, setIsAdding] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [newProcedure, setNewProcedure] = useState<Omit<Procedure, 'procedureId'>>({
        cptCode: '',
        procedureDescription: '',
        date: ''
    });

    const handleAddProcedure = async (e?: React.FormEvent) => {
        e?.preventDefault();
        setError(null);
        
        const trimmedDescription = newProcedure.procedureDescription.trim();
        if (!trimmedDescription) {
            setError("Procedure description cannot be empty");
            return;
        }

        const payload = {
            cptCode: newProcedure.cptCode.trim(),
            description: trimmedDescription,
            date: changeDate(newProcedure.date),
        };
        try {
            const res = await fetchApi("POST", "/procedures/add", {
                body: JSON.stringify(payload),
                headers: { "Content-Type": "application/json" },
            });
            if (res.ok) {
                const data = await res.json();
                const mappedData: Procedure = {
                    procedureId: data.procedureId,
                    cptCode: data.cptCode,
                    procedureDescription: data.procedureDescription,
                    date: data.procedureDate || data.date || ''
                };
                setProceduresList(prev => [...prev, mappedData]);
                setNewProcedure({ cptCode: '', procedureDescription: '', date: '' });
                setIsAdding(false);
                setError(null);
            } else {
                const errorData = await res.json().catch(() => ({}));
                const errorMessage = errorData.details?.description?.[0] || errorData.message || `Failed to add procedure (${res.status})`;
                setError(errorMessage);
                console.error("Add failed", res.status, errorData);
            }
        } catch (err) {
            setError("Failed to add procedure. Please try again.");
            console.error("Add error", err);
        }
    };

    const handleDeleteProcedure = async (id: number) => {
        try {
            const res = await fetchApi("DELETE", `/procedures/${id}/delete`);
            if (res.ok) {
                setProceduresList(prev => prev.filter(p => p.procedureId !== id));
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
                <div className="card-header text-white d-flex justify-content-between align-items-center" style={{ backgroundColor: "#20c997", borderRadius: "12px 12px 0 0", padding: "1rem 1.25rem" }}>
                    <h5 className="mb-0 d-flex align-items-center">
                        <IconScissors size={20} className="me-2" />
                        {t("medicalcard.procedures", lang)}
                    </h5>
                    <button className="btn btn-sm btn-light" onClick={() => setIsAdding(!isAdding)}>
                        <IconPlus size={16} />
                    </button>
                </div>
                <div className="card-body p-3" style={{ maxHeight: "400px", overflowY: "auto" }}>
                    {isAdding && (
                        <div className="border rounded p-3 mb-3" style={{ backgroundColor: "#e6fcf5" }}>
                            {error && (
                                <div className="alert alert-danger alert-dismissible fade show" role="alert" style={{ fontSize: "0.875rem", padding: "0.5rem 0.75rem" }}>
                                    {error}
                                    <button type="button" className="btn-close btn-close-sm" onClick={() => setError(null)} aria-label="Close"></button>
                                </div>
                            )}
                            <div className="mb-2">
                                <label className="form-label small fw-semibold text-muted mb-1">{t("medicalcard.procedure_code", lang)}</label>
                                <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    value={newProcedure.cptCode}
                                    onChange={(e) => setNewProcedure({ ...newProcedure, cptCode: e.target.value })}
                                    placeholder={t("medicalcard.procedure_code", lang)}
                                />
                            </div>
                            <div className="mb-2">
                                <label className="form-label small fw-semibold text-muted mb-1">{t("medicalcard.description", lang)}</label>
                                <textarea
                                    className="form-control form-control-sm"
                                    rows={2}
                                    value={newProcedure.procedureDescription}
                                    onChange={(e) => {
                                        setNewProcedure({ ...newProcedure, procedureDescription: e.target.value });
                                        setError(null);
                                    }}
                                    placeholder={t("medicalcard.description", lang)}
                                    required
                                ></textarea>
                            </div>
                            <div className="mb-2">
                                <label className="form-label small fw-semibold text-muted mb-1">{t("medicalcard.procedure_date", lang)}</label>
                                <input
                                    type="date"
                                    className="form-control form-control-sm"
                                    value={newProcedure.date}
                                    onChange={(e) => setNewProcedure({ ...newProcedure, date: e.target.value })}
                                />
                            </div>
                            <div className="d-flex gap-2">
                                <button className="btn btn-sm btn-success" onClick={handleAddProcedure}>
                                    {t("button.add", lang)}
                                </button>
                                <button className="btn btn-sm btn-secondary" onClick={() => {
                                    setIsAdding(false);
                                    setError(null);
                                }}>
                                    {t("button.cancel", lang)}
                                </button>
                            </div>
                        </div>
                    )}
                    {proceduresList.map((proc) => {
                        const dateValue = (proc as any).procedureDate || proc.date || '';
                        return (
                        <div key={proc.procedureId} className="border rounded p-3 mb-3" style={{ backgroundColor: "#e6fcf5" }}>
                            <div className="mb-2">
                                <label className="form-label small fw-semibold text-muted mb-1">{t("medicalcard.procedure_code", lang)}</label>
                                <input type="text" className="form-control form-control-sm" value={proc.cptCode} readOnly />
                            </div>
                            <div className="mb-2">
                                <label className="form-label small fw-semibold text-muted mb-1">{t("medicalcard.description", lang)}</label>
                                <textarea className="form-control form-control-sm" rows={2} value={proc.procedureDescription} readOnly></textarea>
                            </div>
                            <div className="mb-2">
                                <label className="form-label small fw-semibold text-muted mb-1">{t("medicalcard.procedure_date", lang)}</label>
                                <input type="date" className="form-control form-control-sm" value={reverseDate(dateValue)} readOnly />
                            </div>
                            <button className="btn btn-sm btn-outline-success d-flex align-items-center" onClick={() => handleDeleteProcedure(proc.procedureId)}>
                                <IconTrash size={16} className="me-1" />
                                {t("button.delete", lang)}
                            </button>
                        </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );

};