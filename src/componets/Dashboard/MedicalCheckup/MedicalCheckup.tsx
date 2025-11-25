import { useLanguage } from "../../../context/LanguageContext.tsx";
import { t } from "../../../assets/languages.ts";
import { IconClipboardHeart, IconPlus, IconTrash } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { changeDate, fetchApi } from "../../../context/utils.ts";

type Checkup = {
    checkupId: number;
    checkupDetails: string;
    checkupDate: string;
};

export const MedicalCheckup = () => {
    const { lang } = useLanguage();

    const [items, setItems] = useState<Checkup[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [showAdd, setShowAdd] = useState(false);
    const [newCheckupDetails, setNewCheckupDetails] = useState("");
    const [newDate, setNewDate] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const fetchExaminations = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetchApi("GET", "/checkups/list");
            if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
            const data = await res.json();
            setItems(data.items ?? []);
        } catch (err: any) {
            console.error("Failed to fetch", err);
            setError("Failed to load examinations");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExaminations();
    }, []);

    const handleAdd = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!newDate || !newCheckupDetails.trim()) return;

        setSubmitting(true);
        try {
            const newExam = {
                date: changeDate(newDate),
                details: newCheckupDetails.trim(),
            };
            const res = await fetchApi("POST", "/checkups/add", {
                body: JSON.stringify(newExam),
                headers: { "Content-Type": "application/json" },
            });
            if (!res.ok) {
                console.error("Add failed", res.status);
                setError("Failed to add examination");
                return;
            }
            await fetchExaminations();
            setNewCheckupDetails("");
            setNewDate("");
            setShowAdd(false);
        } catch (err) {
            console.error("Add error", err);
            setError("Failed to add examination");
        } finally {
            setSubmitting(false);
        }
    };

    const deleteExam = async (id: number) => {
        try {
            const res = await fetchApi("DELETE", `/checkups/${id}/delete`);
            if (!res.ok) {
                console.error("Delete failed", res.status);
                setError("Failed to delete examination");
                return;
            }
            await fetchExaminations();
        } catch (err) {
            console.error("Delete error", err);
            setError("Failed to delete examination");
        }
    };

    return (
        <div className="col-lg-6">
            <div className="card shadow-sm border-0 h-100" style={{ borderRadius: "12px" }}>
                <div
                    className="card-header text-white d-flex justify-content-between align-items-center"
                    style={{ backgroundColor: "#6f42c1", borderRadius: "12px 12px 0 0", padding: "1rem 1.25rem" }}
                >
                    <h5 className="mb-0 d-flex align-items-center">
                        <IconClipboardHeart size={20} className="me-2" />
                        {t("medicalcard.examinations", lang)}
                    </h5>
                    <button className="btn btn-sm btn-light" onClick={() => setShowAdd((s) => !s)}>
                        <IconPlus size={16} />
                    </button>
                </div>

                <div className="card-body p-3" style={{ maxHeight: "400px", overflowY: "auto" }}>
                    {showAdd && (
                        <form onSubmit={handleAdd} className="border rounded p-3 mb-3" style={{ backgroundColor: "#fffaf0" }}>
                            <div className="mb-2">
                                <label className="form-label small fw-semibold text-muted mb-1">
                                    {t("medicalcard.result", lang)}
                                </label>
                                <textarea
                                    className="form-control form-control-sm"
                                    rows={2}
                                    value={newCheckupDetails}
                                    onChange={(e) => setNewCheckupDetails(e.target.value)}
                                    disabled={submitting}
                                />
                            </div>

                            <div className="row g-2">
                                <div className="col-6">
                                    <label className="form-label small fw-semibold text-muted mb-1">
                                        {t("medicalcard.examination_date", lang)}
                                    </label>
                                    <input
                                        type="date"
                                        className="form-control form-control-sm"
                                        value={newDate}
                                        onChange={(e) => setNewDate(e.target.value)}
                                        disabled={submitting}
                                    />
                                </div>
                            </div>

                            <div className="mt-2 d-flex gap-2">
                                <button type="submit" className="btn btn-sm btn-primary" disabled={submitting}>
                                    {submitting ? t("button.saving", lang) : t("button.add", lang)}
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-secondary"
                                    onClick={() => setShowAdd(false)}
                                    disabled={submitting}
                                >
                                    {t("button.cancel", lang)}
                                </button>
                            </div>
                        </form>
                    )}

                    {loading && <div className="text-muted">{t("loading", lang)}</div>}
                    {error && <div className="text-danger small mb-2">{error}</div>}

                    {!loading && items.length === 0 && <div className="text-muted">{t("medicalcard.no_data", lang)}</div>}

                    {items.map((exam) => (
                        <div key={exam.checkupId} className="border rounded p-3 mb-3" style={{ backgroundColor: "#faf5ff" }}>
                            <div className="mb-2">
                                <label className="form-label small fw-semibold text-muted mb-1">
                                    {t("medicalcard.examination_type", lang)}
                                </label>
                                <input type="text" className="form-control form-control-sm" value={String(exam.checkupId)} readOnly />
                            </div>

                            <div className="mb-2">
                                <label className="form-label small fw-semibold text-muted mb-1">
                                    {t("medicalcard.result", lang)}
                                </label>
                                <textarea className="form-control form-control-sm" rows={2} value={exam.checkupDetails} readOnly />
                            </div>

                            <div className="row g-2">
                                <div className="col-6">
                                    <label className="form-label small fw-semibold text-muted mb-1">
                                        {t("medicalcard.examination_date", lang)}
                                    </label>
                                    <input type="date" className="form-control form-control-sm" value={exam.checkupDate} readOnly />
                                </div>
                            </div>

                            <button
                                className="btn btn-sm btn-outline-secondary mt-2 d-flex align-items-center"
                                onClick={() => deleteExam(exam.checkupId)}
                            >
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