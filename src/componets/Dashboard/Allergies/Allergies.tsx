import { useLanguage } from "../../../context/LanguageContext.tsx";
import { t } from "../../../assets/languages.ts";
import {
    IconAlertTriangle,
    IconPlus,
    IconTrash,
    IconX,
} from "@tabler/icons-react";
import { useState } from "react";
import { fetchApi } from "../../../context/utils.ts";
import type {Allergy , AllergiesProps} from "../../../context/types.ts";



export const Allergies = ({allergies: initialAllergies = []}: AllergiesProps) => {
    const { lang } = useLanguage();

    const [allergies, setAllergies] = useState<Allergy[]>(initialAllergies);
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
            const res = await fetchApi("POST", "/allergies/add", {
                body: JSON.stringify(payload),
                headers: { "Content-Type": "application/json" },
            });
            if (res.ok) {
                await fetchAllergies();
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

    const deleteAllergy = async (id: number) => {
        try {
            const res = await fetchApi("DELETE", `/allergies/${id}/delete`);
            if (res.ok) {
                setAllergies(prev => prev.filter(a => a.allergyId !== id));
            } else {
                console.error("Delete failed", res.status);
            }
        } catch (err) {
            console.error("Delete error", err);
        }
    };

    const fetchAllergies = async () => {
        try {
            const res = await fetchApi("GET", "/allergies/list");
            if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
            const data = await res.json();
            setAllergies(data.items || []);
        } catch (err) {
            console.error("Failed to fetch allergies", err);
        }
    };


    return (
        <div className="col-lg-6">
            <div
                className="card shadow-sm border-0 h-100"
                style={{ borderRadius: "12px" }}
            >
                <div
                    className="card-header bg-danger text-white d-flex justify-content-between align-items-center"
                    style={{
                        borderRadius: "12px 12px 0 0",
                        padding: "1rem 1.25rem",
                    }}
                >
                    <h5 className="mb-0 d-flex align-items-center">
                        <IconAlertTriangle size={20} className="me-2" />
                        {t("medicalcard.allergies", lang)}
                    </h5>

                    <div className="d-flex align-items-center">
                        <button
                            className="btn btn-sm btn-light me-2"
                            onClick={() => setShowAdd((s) => !s)}
                            aria-expanded={showAdd}
                        >
                            {showAdd ? <IconX size={16} /> : <IconPlus size={16} />}
                            <span className="ms-1 d-none d-md-inline">
              </span>
                        </button>
                    </div>
                </div>

                <div className="card-body p-3" style={{ maxHeight: "400px", overflowY: "auto" }}>
                    {showAdd && (
                        <form
                            onSubmit={handleAdd}
                            className="border rounded p-3 mb-3"
                            style={{ backgroundColor: "#fffaf0" }}
                        >
                            <div className="row g-2 align-items-end">
                                <div className="col-12 col-md-5">
                                    <label className="form-label small fw-semibold text-muted mb-1">
                                        {t("medicalcard.allergy_name", lang)}
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                    />
                                </div>

                                <div className="col-12 col-md-5">
                                    <label className="form-label small fw-semibold text-muted mb-1">
                                        {t("medicalcard.description", lang)}
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        value={newDesc}
                                        onChange={(e) => setNewDesc(e.target.value)}
                                    />
                                </div>

                                <div className="col-12 col-md-2 d-grid">
                                    <button
                                        type="submit"
                                        className="btn btn-sm btn-success"
                                    >
                                        {t("button.add", lang)}
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}
                        <>
                            {allergies.map((allergy) => (
                                <div
                                    key={allergy.allergyId}
                                    className="border rounded p-3 mb-3"
                                    style={{ backgroundColor: "#fff5f5" }}
                                >
                                    <div className="mb-2">
                                        <label className="form-label small fw-semibold text-muted mb-1">
                                            {t("medicalcard.allergy_name", lang)}
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            value={allergy.name}
                                            readOnly
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <label className="form-label small fw-semibold text-muted mb-1">
                                            {t("medicalcard.description", lang)}
                                        </label>
                                        <textarea
                                            className="form-control form-control-sm"
                                            rows={2}
                                            value={allergy.description}
                                            readOnly
                                        ></textarea>
                                    </div>
                                    <div className="d-flex justify-content-end">
                                        <button
                                            className="btn btn-sm btn-outline-danger d-flex align-items-center"
                                            onClick={() => deleteAllergy(allergy.allergyId)}
                                        >
                                            <IconTrash size={16} className="me-1" />
                                            {t("medicalcard.delete_allergy", lang)}
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {allergies.length === 0 && (
                                <p className="text-muted text-center py-4">
                                    {t("medicalcard.no_data", lang)}
                                </p>
                            )}
                        </>
                </div>
            </div>
        </div>
    );
};