import {type FormEvent, useEffect, useState} from "react";
import { Navigate } from "react-router-dom";
import {Button, Card, Col, Form, InputGroup, Row, Spinner} from "react-bootstrap";
import {t} from "../../assets/languages.ts";
import { fetchSesion} from "../../context/utils.ts";
import {useLanguage} from "../../context/LanguageContext.tsx";



export const Login = () => {
    const [pesel, setPesel] = useState("");
    const [password, setPassword] = useState("");
    const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
    const { lang } = useLanguage();


    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        fetch('https://dom.optotel.pl/api/auth/login', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                pesel: pesel,
                password: password
            })
        }).then(res => setLoggedIn(res.ok))
    }

    useEffect(() => {
        fetchSesion(setLoggedIn)
    }, []);

    if(loggedIn === null)
        return (
            <div className="d-flex align-items-center justify-content-center py-5 bg-light" style={{ minHeight: "calc(100vh - 140px)" }}>
                <div className="text-center">
                    <Spinner animation="border" role="status" className="mb-3">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                    <p className="text-muted">Loading...</p>
                </div>
            </div>
        );

    if(loggedIn)
        return <Navigate to="/dashboard"></Navigate>;

    return (
        <div className="d-flex align-items-center justify-content-center py-5 bg-light" style={{ minHeight: "calc(100vh - 140px)" }}>
            <Card className="shadow-sm" style={{ maxWidth: 640, width: "100%" }}>
                <Card.Body>
                    <Row className="align-items-center mb-4">
                        <Col xs="auto">
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
                                <img src="/user.svg" alt="user avatar" />
                            </div>
                        </Col>
                        <Col>
                            <h4 className="mb-1">{t("auth.login_title", lang)}</h4>
                            <small className="text-muted">{t("auth.subtitle", lang)}</small>
                        </Col>
                    </Row>

                    <Form onSubmit={handleSubmit} noValidate>
                        <Form.Group controlId="loginPesel" className="mb-3">
                            <Form.Label className="fw-semibold">{t("auth.pesel", lang)}</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type="text"
                                    inputMode="numeric"
                                    pattern="\d*"
                                    placeholder="12345678901"
                                    value={pesel}
                                    onChange={(e) => setPesel(e.target.value)}
                                    maxLength={11}
                                    aria-label={t("auth.pesel", lang)}
                                />
                            </InputGroup>
                        </Form.Group>

                        <Form.Group controlId="loginPassword" className="mb-3">
                            <Form.Label className="fw-semibold">{t("auth.password", lang)}</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                aria-label={t("auth.password", lang)}
                            />
                        </Form.Group>

                            <Button variant="link" className="p-0 text-decoration-none" type="button">
                                {t("auth.forgot", lang)}
                            </Button>
                        <div className="d-grid">
                            <Button
                                type="submit"
                                className="d-flex justify-content-center align-items-center gap-2"
                            >
                                {t("auth.Login", lang)}
                            </Button>
                        </div>
                    </Form>

                </Card.Body>
                <Card.Footer className="text-muted small text-center">
                    {t("auth.login_help", lang)}
                </Card.Footer>
            </Card>
        </div>
    );
}