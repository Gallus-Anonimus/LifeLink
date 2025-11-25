import { type FormEvent, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Alert,
    Button,
    Card,
    Col,
    Form,
    Row,
    Spinner,
    Toast,
    InputGroup,
} from "react-bootstrap";
import { t, tt } from "../../assets/languages.ts";
import { passes } from "../../assets/pass.ts";
import { useLanguage } from "../../context/LanguageContext.tsx";
import { fetchApi } from "../../context/utils.ts";
import {IconUser} from "@tabler/icons-react";

interface LoginCodeProps {
    NFCcode?: string;
    onSuccess?: () => void;
}

const LoginCode = ({ NFCcode, onSuccess }: LoginCodeProps = {} as LoginCodeProps) => {
    const { id } = useParams<{ id?: string }>();
    const navigate = useNavigate();
    const { lang } = useLanguage();
    const [userId, setUserId] = useState(id ?? NFCcode ?? "");
    const [code, setCode] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isNavigating, setIsNavigating] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [message, setMessage] = useState<string | null>(null);
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        if (id) {
            setUserId(id);
        } else if (NFCcode) {
            setUserId(NFCcode);
        }
    }, [id, NFCcode]);

    const selectedUser = passes.find(([passId]) => passId.toString() === userId)?.[1] ?? "";

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!userId.trim() || !code.trim()) {
            setStatus("error");
            setMessage(t("logincode.error_user_id", lang));
            return;
        }

        setIsSubmitting(true);
        setStatus("idle");
        setMessage(null);
        setShowToast(false);

        try {
            const response = await fetchApi("POST", "/auth/generate-token", {
                body: JSON.stringify({
                    nfcTagUid: userId.trim(),
                    nfcCode: code.trim()
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                
                if (response.status === 401) {
                    setStatus("error");
                    setMessage(t("logincode.error_invalid_code", lang));
                } else if (response.status === 404) {
                    setStatus("error");
                    setMessage(errorData.details || t("logincode.error_invalid_user", lang));
                } else if (response.status === 400) {
                    setStatus("error");
                    const details = errorData.details || {};
                    const errors = Object.values(details).flat().join(", ");
                    setMessage(errors || t("logincode.error_user_id", lang));
                } else {
                    setStatus("error");
                    setMessage(errorData.details || t("logincode.error_generic", lang));
                }
                return;
            }

            const data = await response.json();

            if (data.token) {
                localStorage.setItem('jwt', data.token);
            } else {
                throw new Error("No token received from server");
            }
            
            setStatus("success");
            setMessage(tt("logincode.success", lang, { user: selectedUser || userId }));
            setShowToast(true);

            setTimeout(() => {
                setIsNavigating(true);
                if (onSuccess) {
                    onSuccess();
                } else {
                    navigate("/medicalCard");
                }
            }, 1500);
        } catch (err) {
            setStatus("error");
            const errorMessage = err instanceof Error 
                ? err.message
                : t("logincode.error_generic", lang);
            setMessage(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const initials = (name: string) =>
        name
            .split(" ")
            .map((p) => p[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();

    return (
        <div className="d-flex align-items-center justify-content-center py-5 bg-light" style={{ position: "relative" }}>
            {isNavigating && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 9999,
                    }}
                >
                    <div className="text-center text-white">
                        <Spinner animation="border" role="status" className="mb-3" style={{ width: "3rem", height: "3rem" }}>
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                        <p className="h5">{t("logincode.navigating", lang) || "Redirecting to medical card..."}</p>
                    </div>
                </div>
            )}
            <Card className="shadow-sm" style={{ maxWidth: 820, width: "100%" }}>
                <Card.Body>
                    <Row className="align-items-center mb-3">
                        <Col className="d-flex align-items-center" xs="auto">
                            <div
                                className="d-flex align-items-center justify-content-center rounded"
                                style={{
                                    width: 56,
                                    height: 56,
                                    background:
                                        "linear-gradient(135deg, rgba(13,110,253,0.95), rgba(102,16,242,0.95))",
                                    color: "white",
                                    fontWeight: 700,
                                    fontSize: 18,
                                }}
                            >
                                <IconUser stroke={2} />
                            </div>
                        </Col>
                        <Col>
                            <h4 className="mb-0">{t("auth.Login", lang)}</h4>
                            <small className="text-muted">{t("logincode.subtitle", lang)}</small>
                        </Col>
                    </Row>

                    <Form onSubmit={handleSubmit} noValidate>
                        <Row className="g-3 align-items-center">
                            <Col xs={12} md={6}>
                                <Form.Group controlId="loginCodeUser">
                                    <Form.Label className="fw-semibold">{t("logincode.user_id", lang)}</Form.Label>
                                    <div className="d-flex align-items-center">
                                        <div
                                            className="d-flex align-items-center justify-content-center rounded-circle me-2"
                                            style={{
                                                width: 40,
                                                height: 40,
                                                backgroundColor: "#e9eefb",
                                                color: "#0d6efd",
                                                fontWeight: 600,
                                            }}
                                            aria-hidden
                                        >
                                            {selectedUser ? initials(selectedUser) : "-"}
                                        </div>
                                        <Form.Control
                                            type="text"
                                            placeholder={t("logincode.user_id_placeholder", lang)}
                                            value={userId}
                                            onChange={(e) => setUserId(e.target.value)}
                                            disabled={isSubmitting}
                                            aria-label={t("logincode.user_id", lang)}
                                            className="flex-grow-1"
                                        />
                                    </div>
                                    {selectedUser && (
                                        <Form.Text className="text-muted">
                                            {tt("logincode.profile", lang, { user: selectedUser })}
                                        </Form.Text>
                                    )}
                                </Form.Group>
                            </Col>

                            <Col xs={12} md={6}>
                                <Form.Group controlId="loginCodeInput">
                                    <Form.Label className="fw-semibold">{t("logincode.security_code", lang)}</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            type="text"
                                            placeholder={t("logincode.placeholder", lang)}
                                            value={code}
                                            onChange={(e) => setCode(e.target.value)}
                                            disabled={isSubmitting}
                                            aria-describedby="codeHelp"
                                            maxLength={16}
                                        />
                                        <Button
                                            variant="outline-secondary"
                                            onClick={() => setCode("")}
                                            disabled={isSubmitting || !code}
                                            aria-label={t("logincode.clear", lang)}
                                        >
                                            {t("logincode.clear", lang)}
                                        </Button>
                                    </InputGroup>
                                    <Form.Text id="codeHelp" className="text-muted">
                                        {t("logincode.code_help", lang)}
                                    </Form.Text>
                                </Form.Group>
                            </Col>

                            <Col xs={12} className="d-flex justify-content-end">
                                <Button
                                    type="submit"
                                    disabled={isSubmitting || !userId.trim() || !code.trim()}
                                    className="d-flex align-items-center"
                                    variant="primary"
                                >
                                    {isSubmitting && (
                                        <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                            className="me-2"
                                        />
                                    )}
                                    {t("button.submit", lang)}
                                </Button>
                            </Col>
                        </Row>
                    </Form>

                    {message && status === "error" && (
                        <Alert variant="danger" className="mt-3">
                            {message}
                        </Alert>
                    )}

                    <div
                        aria-live="polite"
                        aria-atomic="true"
                        className="position-relative"
                        style={{ minHeight: 60 }}
                    >
                        <div className="position-absolute top-0 end-0">
                            <Toast
                                show={showToast}
                                onClose={() => setShowToast(false)}
                                bg="success"
                                autohide
                                delay={3000}
                            >
                                <Toast.Header>
                                    <strong className="me-auto">{t("logincode.success_title", lang)}</strong>
                                    <small>Now</small>
                                </Toast.Header>
                                <Toast.Body className="text-white">{message}</Toast.Body>
                            </Toast>
                        </div>
                    </div>
                </Card.Body>

                <Card.Footer className="d-flex justify-content-between text-muted small">
                    <span>{t("logincode.help", lang)}</span>
                    <span>v1.0.0</span>
                </Card.Footer>
            </Card>
        </div>
    );
};

export default LoginCode;