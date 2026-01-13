import { useEffect, useState, useCallback } from "react";
import { Navigate } from "react-router-dom";
import { Spinner, Alert, Badge, Modal, Button, Form } from "react-bootstrap";
import {
    IconPill,
    IconCheck,
    IconX,
    IconClock,
    IconAlertTriangle,
    IconPlus,
    IconTrash,
    IconCalendarTime,
} from "@tabler/icons-react";
import { useLanguage } from "../../context/LanguageContext.tsx";
import { t } from "../../assets/languages.ts";
import { fetchApi } from "../../context/utils.ts";
import type {
    Medication,
    MedicationIntake,
    MedicationSchedule,
} from "../../context/types.ts";

// ============ MOCK DATA - Remove when backend is ready ============
const USE_MOCK_DATA = true;

const MOCK_MEDICATIONS: Medication[] = [
    { medicineId: 1, name: "Metformin", dosage: "500mg", frequency: "2x daily", startDate: "2025-01-01", endDate: null },
    { medicineId: 2, name: "Lisinopril", dosage: "10mg", frequency: "1x daily", startDate: "2025-01-01", endDate: null },
    { medicineId: 3, name: "Atorvastatin", dosage: "20mg", frequency: "1x daily", startDate: "2025-01-01", endDate: null },
    { medicineId: 4, name: "Omeprazole", dosage: "20mg", frequency: "1x daily", startDate: "2025-01-01", endDate: null },
    { medicineId: 5, name: "Vitamin D3", dosage: "1000 IU", frequency: "1x daily", startDate: "2025-01-01", endDate: null },
];

const MOCK_SCHEDULES: MedicationSchedule[] = [
    { scheduleId: 1, medicineId: 1, medicineName: "Metformin", dosage: "500mg", scheduledTime: "08:00", days: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"], notes: "Take with breakfast", isActive: true },
    { scheduleId: 2, medicineId: 1, medicineName: "Metformin", dosage: "500mg", scheduledTime: "20:00", days: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"], notes: "Take with dinner", isActive: true },
    { scheduleId: 3, medicineId: 2, medicineName: "Lisinopril", dosage: "10mg", scheduledTime: "09:00", days: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"], notes: null, isActive: true },
    { scheduleId: 4, medicineId: 3, medicineName: "Atorvastatin", dosage: "20mg", scheduledTime: "21:00", days: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"], notes: "Take before bed", isActive: true },
    { scheduleId: 5, medicineId: 5, medicineName: "Vitamin D3", dosage: "1000 IU", scheduledTime: "12:00", days: ["MONDAY", "WEDNESDAY", "FRIDAY"], notes: null, isActive: true },
];

const generateMockIntakes = (): MedicationIntake[] => {
    const now = new Date();
    const currentHour = now.getHours();
    const today = now.toISOString().split("T")[0];
    const dayName = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"][now.getDay()];

    return MOCK_SCHEDULES
        .filter(s => s.days.includes(dayName))
        .map((schedule, index) => {
            const scheduleHour = parseInt(schedule.scheduledTime.split(":")[0]);
            let status: "PENDING" | "TAKEN" | "MISSED" | "SKIPPED" = "PENDING";
            let takenAt: string | null = null;    

            // Simulate some taken medications (morning ones)
            if (scheduleHour < 10 && currentHour >= 10) {
                status = "TAKEN";
                takenAt = `${today}T${schedule.scheduledTime}:00`;
            }
            // Simulate missed if scheduled time passed more than 2 hours ago
            else if (scheduleHour < currentHour - 2) {
                status = "MISSED";
            }

            return {
                intakeId: index + 1,
                scheduleId: schedule.scheduleId,
                medicineName: schedule.medicineName,
                dosage: schedule.dosage,
                scheduledTime: schedule.scheduledTime,
                takenAt,
                status,
                date: today,
            };
        });
};
// ============ END MOCK DATA ============

const DAYS_OF_WEEK = [
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
    const [todayIntakes, setTodayIntakes] = useState<MedicationIntake[]>([]);
    const [schedules, setSchedules] = useState<MedicationSchedule[]>([]);
    const [medications, setMedications] = useState<Medication[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Form state for new schedule
    const [selectedMedicineId, setSelectedMedicineId] = useState<number | "">("");
    const [scheduledTime, setScheduledTime] = useState("08:00");
    const [selectedDays, setSelectedDays] = useState<string[]>([
        "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"
    ]);
    const [scheduleNotes, setScheduleNotes] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const fetchTodayIntakes = useCallback(async () => {
        if (USE_MOCK_DATA) {
            setTodayIntakes(generateMockIntakes());
            return;
        }
        try {
            const res = await fetchApi("GET", "/medicines/intakes/today");
            if (res.ok) {
                const data = await res.json();
                setTodayIntakes(data.items || []);
            } else if (res.status === 404) {
                setTodayIntakes([]);
            } else {
                throw new Error("Failed to fetch");
            }
        } catch (err) {
            console.error("Failed to fetch today's intakes", err);
            setTodayIntakes([]);
        }
    }, []);

    const fetchSchedules = useCallback(async () => {
        if (USE_MOCK_DATA) {
            setSchedules([...MOCK_SCHEDULES]);
            return;
        }
        try {
            const res = await fetchApi("GET", "/medicines/schedules");
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
        if (USE_MOCK_DATA) {
            setMedications([...MOCK_MEDICATIONS]);
            return;
        }
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
            if (USE_MOCK_DATA) {
                setLoggedIn(true);
                return;
            }
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
            Promise.all([fetchTodayIntakes(), fetchSchedules(), fetchMedications()])
                .finally(() => setLoading(false));
        }
    }, [loggedIn, fetchTodayIntakes, fetchSchedules, fetchMedications]);

    // Auto-refresh every minute to check for missed medications
    useEffect(() => {
        if (!loggedIn) return;
        const interval = setInterval(() => {
            fetchTodayIntakes();
        }, 60000);
        return () => clearInterval(interval);
    }, [loggedIn, fetchTodayIntakes]);

    const markIntake = async (intakeId: number, status: "TAKEN" | "SKIPPED") => {
        if (USE_MOCK_DATA) {
            setTodayIntakes(prev => prev.map(intake =>
                intake.intakeId === intakeId
                    ? { ...intake, status, takenAt: status === "TAKEN" ? new Date().toISOString() : null }
                    : intake
            ));
            setSuccessMessage(t("medtracker.intake_updated", lang));
            setTimeout(() => setSuccessMessage(null), 3000);
            return;
        }
        try {
            const res = await fetchApi("PATCH", `/medicines/intakes/${intakeId}`, {
                body: JSON.stringify({ status }),
            });
            if (res.ok) {
                setSuccessMessage(t("medtracker.intake_updated", lang));
                await fetchTodayIntakes();
                setTimeout(() => setSuccessMessage(null), 3000);
            } else {
                setError(t("medtracker.error_update", lang));
                setTimeout(() => setError(null), 3000);
            }
        } catch (err) {
            console.error("Failed to update intake", err);
            setError(t("medtracker.error_update", lang));
            setTimeout(() => setError(null), 3000);
        }
    };

    const handleAddSchedule = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedMedicineId || selectedDays.length === 0) return;

        setSubmitting(true);
        
        if (USE_MOCK_DATA) {
            const med = medications.find(m => m.medicineId === selectedMedicineId);
            if (med) {
                const newSchedule: MedicationSchedule = {
                    scheduleId: Date.now(),
                    medicineId: med.medicineId,
                    medicineName: med.name,
                    dosage: med.dosage,
                    scheduledTime,
                    days: selectedDays,
                    notes: scheduleNotes || null,
                    isActive: true,
                };
                setSchedules(prev => [...prev, newSchedule]);
                MOCK_SCHEDULES.push(newSchedule);
                setSuccessMessage(t("medtracker.schedule_created", lang));
                setShowAddModal(false);
                resetForm();
                // Regenerate today's intakes to include new schedule
                setTodayIntakes(generateMockIntakes());
                setTimeout(() => setSuccessMessage(null), 3000);
            }
            setSubmitting(false);
            return;
        }
        
        try {
            const res = await fetchApi("POST", "/medicines/schedules", {
                body: JSON.stringify({
                    medicineId: selectedMedicineId,
                    scheduledTime,
                    days: selectedDays,
                    notes: scheduleNotes || null,
                }),
            });
            if (res.ok) {
                setSuccessMessage(t("medtracker.schedule_created", lang));
                setShowAddModal(false);
                resetForm();
                await Promise.all([fetchSchedules(), fetchTodayIntakes()]);
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

        if (USE_MOCK_DATA) {
            setSchedules(prev => prev.filter(s => s.scheduleId !== scheduleId));
            const idx = MOCK_SCHEDULES.findIndex(s => s.scheduleId === scheduleId);
            if (idx > -1) MOCK_SCHEDULES.splice(idx, 1);
            setTodayIntakes(prev => prev.filter(i => i.scheduleId !== scheduleId));
            setSuccessMessage(t("medtracker.schedule_deleted", lang));
            setTimeout(() => setSuccessMessage(null), 3000);
            return;
        }

        try {
            const res = await fetchApi("DELETE", `/medicines/schedules/${scheduleId}`);
            if (res.ok) {
                setSuccessMessage(t("medtracker.schedule_deleted", lang));
                await Promise.all([fetchSchedules(), fetchTodayIntakes()]);
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

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "TAKEN":
                return <Badge bg="success" className="d-flex align-items-center gap-1"><IconCheck size={14} />{t("medtracker.status.taken", lang)}</Badge>;
            case "MISSED":
                return <Badge bg="danger" className="d-flex align-items-center gap-1"><IconAlertTriangle size={14} />{t("medtracker.status.missed", lang)}</Badge>;
            case "SKIPPED":
                return <Badge bg="secondary" className="d-flex align-items-center gap-1"><IconX size={14} />{t("medtracker.status.skipped", lang)}</Badge>;
            default:
                return <Badge bg="warning" text="dark" className="d-flex align-items-center gap-1"><IconClock size={14} />{t("medtracker.status.pending", lang)}</Badge>;
        }
    };

    const pendingCount = todayIntakes.filter(i => i.status === "PENDING").length;
    const missedCount = todayIntakes.filter(i => i.status === "MISSED").length;
    const allTaken = todayIntakes.length > 0 && todayIntakes.every(i => i.status === "TAKEN" || i.status === "SKIPPED");

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

            {/* Status Alert */}
            {missedCount > 0 && (
                <Alert variant="danger" className="d-flex align-items-center gap-2 py-2 mb-2">
                    <IconAlertTriangle size={20} />
                    <strong>{t("medtracker.alert_missed", lang)}</strong> ({missedCount})
                </Alert>
            )}
            {pendingCount > 0 && missedCount === 0 && (
                <Alert variant="warning" className="d-flex align-items-center gap-2 py-2 mb-2">
                    <IconClock size={20} />
                    <strong>{t("medtracker.alert_pending", lang)}</strong> ({pendingCount})
                </Alert>
            )}
            {allTaken && todayIntakes.length > 0 && (
                <Alert variant="success" className="d-flex align-items-center gap-2 py-2 mb-2">
                    <IconCheck size={20} />
                    <strong>{t("medtracker.all_taken", lang)}</strong>
                </Alert>
            )}

            <div className="row g-4" style={{ minHeight: "calc(100vh - 280px)" }}>
                {/* Today's Medications */}
                <div className="col-lg-6">
                    <div className="card shadow-sm border-0" style={{ borderRadius: "12px", minHeight: "calc(100vh - 280px)" }}>
                        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center" style={{ borderRadius: "12px 12px 0 0", padding: "1rem 1.25rem" }}>
                            <h5 className="mb-0 d-flex align-items-center">
                                <IconCalendarTime size={20} className="me-2" />
                                {t("medtracker.today", lang)}
                            </h5>
                        </div>
                        <div className="card-body p-3" style={{ maxHeight: "calc(100vh - 340px)", overflowY: "auto" }}>
                            {todayIntakes.length === 0 ? (
                                <div className="text-center text-muted py-4">
                                    <IconPill size={48} className="mb-2 opacity-50" />
                                    <p>{t("medtracker.no_medications_today", lang)}</p>
                                </div>
                            ) : (
                                todayIntakes.map((intake) => (
                                    <div key={intake.intakeId} className="border rounded p-3 mb-3" style={{
                                        backgroundColor: intake.status === "MISSED" ? "#fff5f5" :
                                            intake.status === "TAKEN" ? "#f0fff4" :
                                                intake.status === "SKIPPED" ? "#f7f7f7" : "#fffbeb"
                                    }}>
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <div>
                                                <h6 className="mb-1 fw-bold">{intake.medicineName}</h6>
                                                <small className="text-muted">{intake.dosage}</small>
                                            </div>
                                            {getStatusBadge(intake.status)}
                                        </div>
                                        <div className="d-flex align-items-center gap-2 mb-2">
                                            <IconClock size={16} className="text-muted" />
                                            <span className="fw-medium">{intake.scheduledTime}</span>
                                            {intake.takenAt && (
                                                <small className="text-success ms-2">
                                                    {t("medtracker.taken_at", lang)}: {new Date(intake.takenAt).toLocaleTimeString(lang === "pl" ? "pl-PL" : "en-US", { hour: "2-digit", minute: "2-digit" })}
                                                </small>
                                            )}
                                        </div>
                                        {intake.status === "PENDING" && (
                                            <div className="d-flex gap-2 mt-2">
                                                <Button
                                                    size="sm"
                                                    variant="success"
                                                    className="d-flex align-items-center gap-1"
                                                    onClick={() => markIntake(intake.intakeId, "TAKEN")}
                                                >
                                                    <IconCheck size={16} />
                                                    {t("medtracker.mark_taken", lang)}
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline-secondary"
                                                    className="d-flex align-items-center gap-1"
                                                    onClick={() => markIntake(intake.intakeId, "SKIPPED")}
                                                >
                                                    <IconX size={16} />
                                                    {t("medtracker.mark_skipped", lang)}
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Schedules */}
                <div className="col-lg-6">
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
                                                <h6 className="mb-1 fw-bold">{schedule.medicineName}</h6>
                                                <small className="text-muted">{schedule.dosage}</small>
                                            </div>
                                            <Badge bg={schedule.isActive ? "success" : "secondary"}>
                                                {schedule.isActive ? t("medtracker.active", lang) : t("medtracker.inactive", lang)}
                                            </Badge>
                                        </div>
                                        <div className="d-flex align-items-center gap-2 mb-2">
                                            <IconClock size={16} className="text-info" />
                                            <span className="fw-bold text-info">{schedule.scheduledTime}</span>
                                        </div>
                                        <div className="d-flex flex-wrap gap-1 mb-2">
                                            {DAYS_OF_WEEK.map(day => (
                                                <Badge
                                                    key={day.key}
                                                    bg={schedule.days.includes(day.key) ? "primary" : "light"}
                                                    text={schedule.days.includes(day.key) ? "white" : "muted"}
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
                                        {med.name} - {med.dosage}
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
