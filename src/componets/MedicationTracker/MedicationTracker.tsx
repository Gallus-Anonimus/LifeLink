import { useEffect, useState, useCallback } from "react";
import { Navigate } from "react-router-dom";
import {Spinner, Alert, Modal, Button, Form, Badge} from "react-bootstrap";
import {
    IconPill,
    IconClock,
    IconPlus,
    IconTrash,
} from "@tabler/icons-react";
import { useLanguage } from "../../context/LanguageContext.tsx";
import { t } from "../../assets/languages.ts";
import {fetchApi, toLocalTime, toUtcTime} from "../../context/utils.ts";
import type {
    Medication,
    MedicationSchedule, WeekDay,
} from "../../context/types.ts";

const DAYS_OF_WEEK :{key:WeekDay,labelKey:string}[] = [
    { key: "MONDAY", labelKey: "medtracker.monday" },
    { key: "TUESDAY", labelKey: "medtracker.tuesday" },
    { key: "WEDNESDAY", labelKey: "medtracker.wednesday" },
    { key: "THURSDAY", labelKey: "medtracker.thursday" },
    { key: "FRIDAY", labelKey: "medtracker.friday" },
    { key: "SATURDAY", labelKey: "medtracker.saturday" },
    { key: "SUNDAY", labelKey: "medtracker.sunday" },
];

export const MedicationTracker = () => {
    const { lang } = useLanguage();
    const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(true);
    const [schedules, setSchedules] = useState<MedicationSchedule[]>([]);
    const [medications, setMedications] = useState<Medication[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [dosage, setDosage] = useState<string>("");

    // Form state for new schedule
    const [selectedMedicineId, setSelectedMedicineId] = useState<number | "">("");
    const [scheduledTime, setScheduledTime] = useState("08:00");
    const [selectedDays, setSelectedDays] = useState<string[]>([
        "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"
    ]);
    const [scheduleNotes, setScheduleNotes] = useState("");
    const [submitting, setSubmitting] = useState(false);


    const fetchSchedules = useCallback(async () => {
        try {
            const res = await fetchApi("GET", "/schedules/list");
            if (res.ok) {
                const data = await res.json();
                setSchedules(data.items || []);
            } else if (res.status === 404) {
                setSchedules([]);
            } else {
                throw new Error("Failed to fetch");
            }
        } catch (err) {
            console.error("Failed to fetch schedules", err);
            setSchedules([]);
        }
    }, []);

    const fetchMedications = useCallback(async () => {
        try {
            const res = await fetchApi("GET", "/medicines/list");
            if (res.ok) {
                const data = await res.json();
                setMedications(data.items || []);
            } else {
                throw new Error("Failed to fetch");
            }
        } catch (err) {
            console.error("Failed to fetch medications", err);
        }
    }, []);

    useEffect(() => {
        const checkSession = async () => {
            try {
                const res = await fetchApi("GET", "/auth/session-status");
                const data = await res.json();
                setLoggedIn(data.active);
            } catch {
                setLoggedIn(false);
            }
        };

        checkSession();
    }, []);

    useEffect(() => {
        if (loggedIn) {
            Promise.all([ fetchSchedules(), fetchMedications()])
                .finally(() => setLoading(false));
        }
    }, [loggedIn, fetchSchedules, fetchMedications]);



    const handleAddSchedule = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedMedicineId || selectedDays.length === 0) return;

        setSubmitting(true);
        
        try {
            console.log(selectedDays)
            const res = await fetchApi("POST", "/schedules/add", {
                body: JSON.stringify({
                    medicineId: selectedMedicineId,
                    executionTime: toUtcTime(scheduledTime),
                    weekDays: selectedDays,
                    dosage: dosage,
                    notes: scheduleNotes || null,
                }),
            });
            if (res.ok) {
                setSuccessMessage(t("medtracker.schedule_created", lang));
                setShowAddModal(false);
                resetForm();
                await Promise.all([fetchSchedules()]);
                setTimeout(() => setSuccessMessage(null), 3000);
            } else {
                setError(t("medtracker.error_update", lang));
                setTimeout(() => setError(null), 3000);
            }
        } catch (err) {
            console.error("Failed to create schedule", err);
            setError(t("medtracker.error_update", lang));
            setTimeout(() => setError(null), 3000);
        } finally {
            setSubmitting(false);
        }
    };

    const deleteSchedule = async (scheduleId: number) => {
        if (!confirm(t("medtracker.confirm_delete", lang))) return;

        try {
            const res = await fetchApi("DELETE", `/schedules/${scheduleId}/delete`);
            if (res.ok) {
                setSuccessMessage(t("medtracker.schedule_deleted", lang));
                await Promise.all([fetchSchedules()]);
                setTimeout(() => setSuccessMessage(null), 3000);
            } else {
                setError(t("medtracker.error_update", lang));
                setTimeout(() => setError(null), 3000);
            }
        } catch (err) {
            console.error("Failed to delete schedule", err);
            setError(t("medtracker.error_update", lang));
            setTimeout(() => setError(null), 3000);
        }
    };

    const resetForm = () => {
        setSelectedMedicineId("");
        setScheduledTime("08:00");
        setSelectedDays(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"]);
        setScheduleNotes("");
        setDosage("")
    };

    const toggleDay = (day: string) => {
        setSelectedDays(prev =>
            prev.includes(day)
                ? prev.filter(d => d !== day)
                : [...prev, day]
        );
    };

    const toggleAllDays = () => {
        if (selectedDays.length === 7) {
            setSelectedDays([]);
        } else {
            setSelectedDays(DAYS_OF_WEEK.map(d => d.key));
        }
    };


    if (loggedIn === null) {
        return (
            <div className="d-flex align-items-center justify-content-center py-5 bg-light" style={{ minHeight: "calc(100vh - 140px)" }}>
                <div className="text-center">
                    <Spinner animation="border" role="status" className="mb-3">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                    <p className="text-muted">{t("loading", lang)}</p>
                </div>
            </div>
        );
    }

    if (!loggedIn) {
        return <Navigate to="/login" />;
    }

    if (loading) {
        return (
            <div className="d-flex align-items-center justify-content-center py-5 bg-light" style={{ minHeight: "calc(100vh - 140px)" }}>
                <div className="text-center">
                    <Spinner animation="border" role="status" className="mb-3">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                    <p className="text-muted">{t("loading", lang)}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid px-4 py-3" style={{ backgroundColor: "#f5f7fa", minHeight: "100vh" }}>
            {/* Header */}
            <div className="row mb-2">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h1 className="h3 mb-0" style={{ color: "#2c3e50", fontWeight: "600" }}>
                                <IconPill className="me-2" size={28} />
                                {t("medtracker.title", lang)}
                            </h1>
                            <p className="text-muted mb-0 small">{t("medtracker.subtitle", lang)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Alerts */}
            {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
            {successMessage && <Alert variant="success" dismissible onClose={() => setSuccessMessage(null)}>{successMessage}</Alert>}

            <div className="row g-4" style={{ minHeight: "calc(100vh - 280px)" }}>
                {/* Schedules */}
                <div className="col-lg-12">
                    <div className="card shadow-sm border-0" style={{ borderRadius: "12px", minHeight: "calc(100vh - 280px)" }}>
                        <div className="card-header bg-info text-white d-flex justify-content-between align-items-center" style={{ borderRadius: "12px 12px 0 0", padding: "1rem 1.25rem" }}>
                            <h5 className="mb-0 d-flex align-items-center">
                                <IconClock size={20} className="me-2" />
                                {t("medtracker.schedules", lang)}
                            </h5>
                            <Button
                                size="sm"
                                variant="light"
                                className="d-flex align-items-center"
                                onClick={() => setShowAddModal(true)}
                            >
                                <IconPlus size={16} />
                            </Button>
                        </div>
                        <div className="card-body p-3" style={{ maxHeight: "calc(100vh - 340px)", overflowY: "auto" }}>
                            {schedules.length === 0 ? (
                                <div className="text-center text-muted py-4">
                                    <IconClock size={48} className="mb-2 opacity-50" />
                                    <p>{t("medtracker.no_schedules", lang)}</p>
                                    <Button variant="primary" size="sm" onClick={() => setShowAddModal(true)}>
                                        <IconPlus size={16} className="me-1" />
                                        {t("medtracker.add_schedule", lang)}
                                    </Button>
                                </div>
                            ) : (
                                schedules.map((schedule) => (
                                    <div key={schedule.scheduleId} className="border rounded p-3 mb-3" style={{ backgroundColor: "#f0f9ff" }}>
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <div>
                                                <h6 className="mb-1 fw-bold">{schedule.medicine.medicineName}</h6>
                                                <small className="text-muted">{schedule.dosage}</small>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center gap-2 mb-2">
                                            <IconClock size={16} className="text-info" />
                                            <span className="fw-bold text-info">{toLocalTime(schedule.executionTime)}</span>
                                        </div>
                                        <div className="d-flex flex-wrap gap-1 mb-2">
                                            {DAYS_OF_WEEK.map(day => (
                                                <Badge
                                                    key={day.key}
                                                    bg={schedule.weekDays.includes(day.key) ? "primary" : "light"}
                                                    text={schedule.weekDays.includes(day.key) ? "white" : "muted"}
                                                    style={{ fontSize: "0.7rem" }}
                                                >
                                                    {t(day.labelKey, lang).slice(0, 3)}
                                                </Badge>
                                            ))}
                                        </div>
                                        {schedule.notes && (
                                            <small className="text-muted d-block mb-2">{schedule.notes}</small>
                                        )}
                                        <div className="d-flex justify-content-end">
                                            <Button
                                                size="sm"
                                                variant="outline-danger"
                                                className="d-flex align-items-center gap-1"
                                                onClick={() => deleteSchedule(schedule.scheduleId)}
                                            >
                                                <IconTrash size={14} />
                                                {t("button.delete", lang)}
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Schedule Modal */}
            <Modal show={showAddModal} onHide={() => { setShowAddModal(false); resetForm(); }} centered>
                <Modal.Header closeButton>
                    <Modal.Title className="d-flex align-items-center gap-2">
                        <IconPlus size={24} />
                        {t("medtracker.add_schedule", lang)}
                    </Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleAddSchedule}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>{t("medtracker.select_medication", lang)}</Form.Label>
                            <Form.Select
                                value={selectedMedicineId}
                                onChange={(e) => setSelectedMedicineId(e.target.value ? Number(e.target.value) : "")}
                                required
                            >
                                <option value="">{t("medtracker.select_medication", lang)}...</option>
                                {medications.map(med => (
                                    <option key={med.medicineId} value={med.medicineId}>
                                        {med.medicineName} ({med.medicineId})
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>{t("medtracker.scheduled_time", lang)}</Form.Label>
                            <Form.Control
                                type="time"
                                value={scheduledTime}
                                onChange={(e) => setScheduledTime(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>{t("medicalcard.dosage", lang)}</Form.Label>
                            <Form.Control
                                type="text"
                                value={dosage}
                                onChange={(e) => setDosage(e.target.value)}
                                required>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>{t("medtracker.select_days", lang)}</Form.Label>
                            <div className="mb-2">
                                <Form.Check
                                    type="checkbox"
                                    label={t("medtracker.all_days", lang)}
                                    checked={selectedDays.length === 7}
                                    onChange={toggleAllDays}
                                    className="fw-bold"
                                />
                            </div>
                            <div className="d-flex flex-wrap gap-2">
                                {DAYS_OF_WEEK.map(day => (
                                    <Form.Check
                                        key={day.key}
                                        type="checkbox"
                                        label={t(day.labelKey, lang)}
                                        checked={selectedDays.includes(day.key)}
                                        onChange={() => toggleDay(day.key)}
                                    />
                                ))}
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>{t("medicalcard.notes", lang)}</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                value={scheduleNotes}
                                onChange={(e) => setScheduleNotes(e.target.value)}
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => { setShowAddModal(false); resetForm(); }}>
                            {t("button.cancel", lang)}
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={submitting || !selectedMedicineId || selectedDays.length === 0}
                        >
                            {submitting ? t("button.saving", lang) : t("button.save", lang)}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
};

export default MedicationTracker;
