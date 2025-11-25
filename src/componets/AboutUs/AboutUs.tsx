import { useLanguage } from "../../context/LanguageContext.tsx";
import { Card, Container, Row, Col } from "react-bootstrap";
import logo from "../../assets/logo.png";
import {IconCheck} from "@tabler/icons-react";

export const AboutUs = () => {
    const { lang } = useLanguage();

    if (lang === "pl") {
        return (
            <div
                className="d-flex align-items-center justify-content-center py-5 bg-light"
                style={{minHeight: "calc(100vh - 140px)"}}
            >
                <Container>
                    <Row className="justify-content-center">
                        <Col lg={10} xl={8}>
                            <Card className="shadow-sm border-0">
                                <Card.Body className="p-5">
                                    <div className="text-center mb-4">
                                        <img
                                            src={logo}
                                            alt="LifeLink Logo"
                                            style={{height: "120px", marginBottom: "2rem"}}
                                        />
                                        <h1
                                            className="display-5 fw-bold mb-3"
                                            style={{color: "#2c3e50"}}
                                        >
                                            O Nas
                                        </h1>
                                        <div
                                            className="mx-auto"
                                            style={{
                                                width: "80px",
                                                height: "4px",
                                                background:
                                                    "linear-gradient(135deg, rgba(13,110,253,0.95), rgba(102,16,242,0.95))",
                                                borderRadius: "2px",
                                            }}
                                        ></div>
                                    </div>

                                    <div className="mt-5">
                                        <h2 className="h3 fw-semibold mb-4" style={{color: "#34495e"}}>
                                            Witamy w LifeLink
                                        </h2>
                                        <p className="lead mb-4" style={{color: "#555", lineHeight: "1.8"}}>
                                            Witamy w LifeLink - nowoczesnej platformie do zarządzania kartą
                                            medyczną online. Naszą misją jest zapewnienie bezpiecznego i
                                            łatwego dostępu do informacji medycznych dla pacjentów i personelu
                                            medycznego.
                                        </p>

                                        <Row className="g-4 mt-4">
                                            <Col md={6}>
                                                <div
                                                    className="p-4 h-100"
                                                    style={{
                                                        background:
                                                            "linear-gradient(135deg, rgba(13,110,253,0.05), rgba(102,16,242,0.05))",
                                                        borderRadius: "12px",
                                                    }}
                                                >
                                                    <h3 className="h5 fw-semibold mb-3" style={{color: "#2c3e50"}}>
                                                        Nasza wizja
                                                    </h3>
                                                    <p style={{color: "#666", lineHeight: "1.7"}}>
                                                        Wierzymy w przyszłość, w której pomoc przychodzi szybciej,
                                                        seniorzy czują się bezpieczniej, a dzieci nie doświadczają
                                                        traumy z powodu zagubienia. Technologia nie oddala ludzi -
                                                        przywraca bliskość i odpowiedzialność. Taką właśnie przyszłość
                                                        chcemy tworzyć.
                                                    </p>
                                                </div>
                                            </Col>
                                            <Col md={6}>
                                                <div
                                                    className="p-4 h-100"
                                                    style={{
                                                        background:
                                                            "linear-gradient(135deg, rgba(13,110,253,0.05), rgba(102,16,242,0.05))",
                                                        borderRadius: "12px",
                                                    }}
                                                >
                                                    <h3 className="h5 fw-semibold mb-3" style={{color: "#2c3e50"}}>
                                                        Co robi LifeLink
                                                    </h3>
                                                    <p style={{color: "#666", lineHeight: "1.7"}}>
                                                        W sytuacji, gdy jesteśmy nieprzytomni, nie mamy telefonu lub
                                                        nie możemy przekazać danych medycznych, LifeLink zrobi to za
                                                        nas. Zawiera najważniejsze informacje medyczne w jednym miejscu,
                                                        dostępne natychmiast tam, gdzie są potrzebne.
                                                    </p>
                                                </div>
                                            </Col>
                                        </Row>

                                        <Row className="mt-5 pt-4" style={{borderTop: "2px solid #e9ecef"}}>
                                            <Col sm={6} md={4}>
                                                <div className="d-flex align-items-start gap-3">
                                                    <div className="flex-shrink-0">
                                                        <div
                                                            className="d-flex align-items-center justify-content-center rounded-circle"
                                                            style={{
                                                                width: "40px",
                                                                height: "40px",
                                                                background:
                                                                    "linear-gradient(135deg, rgba(13,110,253,0.95), rgba(102,16,242,0.95))",
                                                                color: "white",
                                                            }}
                                                        >
                                                            <IconCheck stroke={2}/>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <strong style={{color: "#2c3e50"}}>Karta Medyczna</strong>
                                                        <p className="small mb-0" style={{color: "#666"}}>
                                                            Pełna historia medyczna - najważniejsze dane zawsze pod ręką
                                                        </p>
                                                    </div>
                                                </div>
                                            </Col>

                                            <Col sm={6} md={4}>
                                                <div className="d-flex align-items-start gap-3">
                                                    <div className="flex-shrink-0">
                                                        <div
                                                            className="d-flex align-items-center justify-content-center rounded-circle"
                                                            style={{
                                                                width: "40px",
                                                                height: "40px",
                                                                background:
                                                                    "linear-gradient(135deg, rgba(13,110,253,0.95), rgba(102,16,242,0.95))",
                                                                color: "white",
                                                            }}
                                                        >
                                                            <IconCheck stroke={2}/>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <strong style={{color: "#2c3e50"}}>Alergie i Leki</strong>
                                                        <p className="small mb-0" style={{color: "#666"}}>
                                                            Zarządzanie alergiami i lekami - przejrzysty plan terapii
                                                        </p>
                                                    </div>
                                                </div>
                                            </Col>

                                            <Col sm={6} md={4}>
                                                <div className="d-flex align-items-start gap-3">
                                                    <div className="flex-shrink-0">
                                                        <div
                                                            className="d-flex align-items-center justify-content-center rounded-circle"
                                                            style={{
                                                                width: "40px",
                                                                height: "40px",
                                                                background:
                                                                    "linear-gradient(135deg, rgba(13,110,253,0.95), rgba(102,16,242,0.95))",
                                                                color: "white",
                                                            }}
                                                        >
                                                            <IconCheck stroke={2}/>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <strong style={{color: "#2c3e50"}}>Szczepienia</strong>
                                                        <p className="small mb-0" style={{color: "#666"}}>
                                                            Historia szczepień
                                                        </p>
                                                    </div>
                                                </div>
                                            </Col>

                                            <Col sm={6} md={4}>
                                                <div className="d-flex align-items-start gap-3">
                                                    <div className="flex-shrink-0">
                                                        <div
                                                            className="d-flex align-items-center justify-content-center rounded-circle"
                                                            style={{
                                                                width: "40px",
                                                                height: "40px",
                                                                background:
                                                                    "linear-gradient(135deg, rgba(13,110,253,0.95), rgba(102,16,242,0.95))",
                                                                color: "white",
                                                            }}
                                                        >
                                                            <IconCheck stroke={2}/>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <strong style={{color: "#2c3e50"}}>Badania</strong>
                                                        <p className="small mb-0" style={{color: "#666"}}>
                                                            Wyniki badań medycznych
                                                        </p>
                                                    </div>
                                                </div>
                                            </Col>

                                            <Col sm={6} md={4}>
                                                <div className="d-flex align-items-start gap-3">
                                                    <div className="flex-shrink-0">
                                                        <div
                                                            className="d-flex align-items-center justify-content-center rounded-circle"
                                                            style={{
                                                                width: "40px",
                                                                height: "40px",
                                                                background:
                                                                    "linear-gradient(135deg, rgba(13,110,253,0.95), rgba(102,16,242,0.95))",
                                                                color: "white",
                                                            }}
                                                        >
                                                            <IconCheck stroke={2}/>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <strong style={{color: "#2c3e50"}}>Diagnozy</strong>
                                                        <p className="small mb-0" style={{color: "#666"}}>
                                                            Historia diagnoz
                                                        </p>
                                                    </div>
                                                </div>
                                            </Col>

                                            <Col sm={6} md={4}>
                                                <div className="d-flex align-items-start gap-3">
                                                    <div className="flex-shrink-0">
                                                        <div
                                                            className="d-flex align-items-center justify-content-center rounded-circle"
                                                            style={{
                                                                width: "40px",
                                                                height: "40px",
                                                                background:
                                                                    "linear-gradient(135deg, rgba(13,110,253,0.95), rgba(102,16,242,0.95))",
                                                                color: "white",
                                                            }}
                                                        >
                                                            <IconCheck stroke={2}/>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <strong style={{color: "#2c3e50"}}>Dostęp Online</strong>
                                                        <p className="small mb-0" style={{color: "#666"}}>
                                                            Dostęp z dowolnego miejsca - zabezpieczony szyfrowaniem i
                                                            hasłem
                                                        </p>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>

                                        <Row className="mt-5 pt-4" style={{borderTop: "2px solid #e9ecef"}}>
                                            <Col xs={12}>
                                                <h3 className="h5 fw-semibold mb-3" style={{color: "#2c3e50"}}>
                                                    Repozytoria (GitHub)
                                                </h3>
                                            </Col>

                                            <Col md={4}>
                                                <div className="d-flex align-items-start gap-3">
                                                    <div className="flex-shrink-0">
                                                        <div
                                                            className="d-flex align-items-center justify-content-center rounded-circle"
                                                            style={{
                                                                width: "40px",
                                                                height: "40px",
                                                                background:
                                                                    "linear-gradient(135deg, rgba(13,110,253,0.95), rgba(102,16,242,0.95))",
                                                                color: "white",
                                                                fontWeight: 600,
                                                            }}
                                                        >
                                                            GH
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <a
                                                            href="https://github.com/Gallus-Anonimus/LifeLink"
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            style={{
                                                                color: "#2c3e50",
                                                                fontWeight: 600,
                                                                textDecoration: "none"
                                                            }}
                                                        >
                                                            Frontend
                                                        </a>
                                                        <p className="small mb-0" style={{color: "#666"}}>
                                                            React + Bootstrap UI aplikacji LifeLink
                                                        </p>
                                                    </div>
                                                </div>
                                            </Col>

                                            <Col md={4}>
                                                <div className="d-flex align-items-start gap-3">
                                                    <div className="flex-shrink-0">
                                                        <div
                                                            className="d-flex align-items-center justify-content-center rounded-circle"
                                                            style={{
                                                                width: "40px",
                                                                height: "40px",
                                                                background:
                                                                    "linear-gradient(135deg, rgba(13,110,253,0.95), rgba(102,16,242,0.95))",
                                                                color: "white",
                                                                fontWeight: 600,
                                                            }}
                                                        >
                                                            GH
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <a
                                                            href="https://github.com/indyplaygame/LifeLink"
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            style={{
                                                                color: "#2c3e50",
                                                                fontWeight: 600,
                                                                textDecoration: "none"
                                                            }}
                                                        >
                                                            Backend
                                                        </a>
                                                        <p className="small mb-0" style={{color: "#666"}}>
                                                            API, autoryzacja i przechowywanie danych
                                                        </p>
                                                    </div>
                                                </div>
                                            </Col>

                                            <Col md={4}>
                                                <div className="d-flex align-items-start gap-3">
                                                    <div className="flex-shrink-0">
                                                        <div
                                                            className="d-flex align-items-center justify-content-center rounded-circle"
                                                            style={{
                                                                width: "40px",
                                                                height: "40px",
                                                                background:
                                                                    "linear-gradient(135deg, rgba(13,110,253,0.95), rgba(102,16,242,0.95))",
                                                                color: "white",
                                                                fontWeight: 600,
                                                            }}
                                                        >
                                                            GH
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <a
                                                            href="https://github.com/VicExe0/lifelink-hw"
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            style={{
                                                                color: "#2c3e50",
                                                                fontWeight: 600,
                                                                textDecoration: "none"
                                                            }}
                                                        >
                                                            Hardware
                                                        </a>
                                                        <p className="small mb-0" style={{color: "#666"}}>
                                                            Projekty i oprogramowanie urządzeń LifeLink
                                                        </p>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>

                                        {/* New section: Team */}
                                        <Row className="mt-4">
                                            <Col xs={12}>
                                                <h3 className="h5 fw-semibold mb-3" style={{color: "#2c3e50"}}>
                                                    Zespół
                                                </h3>
                                            </Col>

                                            <Col md={6} lg={3} className="mb-3">
                                                <div className="d-flex align-items-start gap-3">
                                                    <div>
                                                        <img
                                                            src="user-circle.svg"
                                                            alt="Member 1"
                                                            className="rounded-circle"
                                                            style={{width: "56px", height: "56px", objectFit: "cover"}}
                                                        />
                                                    </div>
                                                    <div>
                                                        <div style={{fontWeight: 700, color: "#2c3e50"}}>Szymon Hamera
                                                        </div>
                                                        <div className="small" style={{color: "#666"}}>
                                                            Project Manager
                                                        </div>
                                                    </div>
                                                </div>
                                            </Col>

                                            <Col md={6} lg={3} className="mb-3">
                                                <div className="d-flex align-items-start gap-3">
                                                    <div>
                                                        <img
                                                            src="user-circle.svg"
                                                            alt="Member 2"
                                                            className="rounded-circle"
                                                            style={{width: "56px", height: "56px", objectFit: "cover"}}
                                                        />
                                                    </div>
                                                    <div>
                                                        <div style={{fontWeight: 700, color: "#2c3e50"}}>Marcin Kowalczyk
                                                        </div>
                                                        <div className="small" style={{color: "#666"}}>Backend
                                                            Developer
                                                        </div>
                                                    </div>
                                                </div>
                                            </Col>

                                            <Col md={6} lg={3} className="mb-3">
                                                <div className="d-flex align-items-start gap-3">
                                                    <div>
                                                        <img
                                                            src="user-circle.svg"
                                                            alt="Member 3"
                                                            className="rounded-circle"
                                                            style={{width: "56px", height: "56px", objectFit: "cover"}}
                                                        />
                                                    </div>
                                                    <div>
                                                        <div style={{fontWeight: 700, color: "#2c3e50"}}>Wiktor Cisowski
                                                        </div>
                                                        <div className="small" style={{color: "#666"}}>Hardware Developer
                                                        </div>

                                                    </div>
                                                </div>
                                            </Col>

                                            <Col md={6} lg={3} className="mb-3">
                                                <div className="d-flex align-items-start gap-3">
                                                    <div>
                                                        <img
                                                            src="user-circle.svg"
                                                            alt="Member 4"
                                                            className="rounded-circle"
                                                            style={{width: "56px", height: "56px", objectFit: "cover"}}
                                                        />
                                                    </div>
                                                    <div>
                                                        <div style={{fontWeight: 700, color: "#2c3e50"}}> Marcin Cioch
                                                        </div>
                                                        <div className="small" style={{color: "#666"}}> Frontend Developer
                                                        </div>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>

                                        <div
                                            className="mt-5 pt-4 text-center"
                                            style={{borderTop: "2px solid #e9ecef"}}
                                        >
                                            <p className="mb-0" style={{color: "#666"}}>
                                                <strong style={{color: "#2c3e50"}}>LifeLink</strong> - Twoja karta
                                                medyczna zawsze pod ręką
                                            </p>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }

    return (
        <div
            className="d-flex align-items-center justify-content-center py-5 bg-light"
            style={{ minHeight: "calc(100vh - 140px)" }}
        >
            <Container>
                <Row className="justify-content-center">
                    <Col lg={10} xl={8}>
                        <Card className="shadow-sm border-0">
                            <Card.Body className="p-5">
                                <div className="text-center mb-4">
                                    <img
                                        src={logo}
                                        alt="LifeLink Logo"
                                        style={{ height: "120px", marginBottom: "2rem" }}
                                    />
                                    <h1
                                        className="display-5 fw-bold mb-3"
                                        style={{ color: "#2c3e50" }}
                                    >
                                        About Us
                                    </h1>
                                    <div
                                        className="mx-auto"
                                        style={{
                                            width: "80px",
                                            height: "4px",
                                            background:
                                                "linear-gradient(135deg, rgba(13,110,253,0.95), rgba(102,16,242,0.95))",
                                            borderRadius: "2px",
                                        }}
                                    ></div>
                                </div>

                                <div className="mt-5">
                                    <h2 className="h3 fw-semibold mb-4" style={{ color: "#34495e" }}>
                                        Welcome to LifeLink
                                    </h2>
                                    <p className="lead mb-4" style={{ color: "#555", lineHeight: "1.8" }}>
                                        Welcome to LifeLink - a modern platform for managing your medical
                                        record online. Our mission is to provide secure and easy access to
                                        medical information for patients and healthcare professionals.
                                    </p>

                                    <Row className="g-4 mt-4">
                                        <Col md={6}>
                                            <div
                                                className="p-4 h-100"
                                                style={{
                                                    background:
                                                        "linear-gradient(135deg, rgba(13,110,253,0.05), rgba(102,16,242,0.05))",
                                                    borderRadius: "12px",
                                                }}
                                            >
                                                <h3 className="h5 fw-semibold mb-3" style={{ color: "#2c3e50" }}>
                                                    Our Vision
                                                </h3>
                                                <p style={{ color: "#666", lineHeight: "1.7" }}>
                                                    We believe in a future where help arrives faster, seniors feel
                                                    safer, and children do not experience trauma from getting
                                                    lost. Technology does not distance people - it restores
                                                    closeness and responsibility. This is the future we want to
                                                    build.
                                                </p>
                                            </div>
                                        </Col>
                                        <Col md={6}>
                                            <div
                                                className="p-4 h-100"
                                                style={{
                                                    background:
                                                        "linear-gradient(135deg, rgba(13,110,253,0.05), rgba(102,16,242,0.05))",
                                                    borderRadius: "12px",
                                                }}
                                            >
                                                <h3 className="h5 fw-semibold mb-3" style={{ color: "#2c3e50" }}>
                                                    What LifeLink Does
                                                </h3>
                                                <p style={{ color: "#666", lineHeight: "1.7" }}>
                                                    In situations where we are unconscious, don't have our phone,
                                                    or cannot communicate medical details, LifeLink will do it
                                                    for us. It stores the most important medical information in
                                                    one place, available immediately where it's needed.
                                                </p>
                                            </div>
                                        </Col>
                                    </Row>

                                    <Row className="mt-5 pt-4" style={{ borderTop: "2px solid #e9ecef" }}>
                                        <Col sm={6} md={4}>
                                            <div className="d-flex align-items-start gap-3">
                                                <div className="flex-shrink-0">
                                                    <div
                                                        className="d-flex align-items-center justify-content-center rounded-circle"
                                                        style={{
                                                            width: "40px",
                                                            height: "40px",
                                                            background:
                                                                "linear-gradient(135deg, rgba(13,110,253,0.95), rgba(102,16,242,0.95))",
                                                            color: "white",
                                                        }}
                                                    >
                                                        <IconCheck stroke={2} />
                                                    </div>
                                                </div>
                                                <div>
                                                    <strong style={{ color: "#2c3e50" }}>Medical Record</strong>
                                                    <p className="small mb-0" style={{ color: "#666" }}>
                                                        Full medical history - the most important data always at hand
                                                    </p>
                                                </div>
                                            </div>
                                        </Col>

                                        <Col sm={6} md={4}>
                                            <div className="d-flex align-items-start gap-3">
                                                <div className="flex-shrink-0">
                                                    <div
                                                        className="d-flex align-items-center justify-content-center rounded-circle"
                                                        style={{
                                                            width: "40px",
                                                            height: "40px",
                                                            background:
                                                                "linear-gradient(135deg, rgba(13,110,253,0.95), rgba(102,16,242,0.95))",
                                                            color: "white",
                                                        }}
                                                    >
                                                        <IconCheck stroke={2} />
                                                    </div>
                                                </div>
                                                <div>
                                                    <strong style={{ color: "#2c3e50" }}>Allergies & Medications</strong>
                                                    <p className="small mb-0" style={{ color: "#666" }}>
                                                        Manage allergies and medications - a clear treatment plan
                                                    </p>
                                                </div>
                                            </div>
                                        </Col>

                                        <Col sm={6} md={4}>
                                            <div className="d-flex align-items-start gap-3">
                                                <div className="flex-shrink-0">
                                                    <div
                                                        className="d-flex align-items-center justify-content-center rounded-circle"
                                                        style={{
                                                            width: "40px",
                                                            height: "40px",
                                                            background:
                                                                "linear-gradient(135deg, rgba(13,110,253,0.95), rgba(102,16,242,0.95))",
                                                            color: "white",
                                                        }}
                                                    >
                                                        <IconCheck stroke={2} />
                                                    </div>
                                                </div>
                                                <div>
                                                    <strong style={{ color: "#2c3e50" }}>Vaccinations</strong>
                                                    <p className="small mb-0" style={{ color: "#666" }}>
                                                        Vaccination history
                                                    </p>
                                                </div>
                                            </div>
                                        </Col>

                                        <Col sm={6} md={4}>
                                            <div className="d-flex align-items-start gap-3">
                                                <div className="flex-shrink-0">
                                                    <div
                                                        className="d-flex align-items-center justify-content-center rounded-circle"
                                                        style={{
                                                            width: "40px",
                                                            height: "40px",
                                                            background:
                                                                "linear-gradient(135deg, rgba(13,110,253,0.95), rgba(102,16,242,0.95))",
                                                            color: "white",
                                                        }}
                                                    >
                                                        <IconCheck stroke={2} />
                                                    </div>
                                                </div>
                                                <div>
                                                    <strong style={{ color: "#2c3e50" }}>Tests</strong>
                                                    <p className="small mb-0" style={{ color: "#666" }}>
                                                        Medical test results
                                                    </p>
                                                </div>
                                            </div>
                                        </Col>

                                        <Col sm={6} md={4}>
                                            <div className="d-flex align-items-start gap-3">
                                                <div className="flex-shrink-0">
                                                    <div
                                                        className="d-flex align-items-center justify-content-center rounded-circle"
                                                        style={{
                                                            width: "40px",
                                                            height: "40px",
                                                            background:
                                                                "linear-gradient(135deg, rgba(13,110,253,0.95), rgba(102,16,242,0.95))",
                                                            color: "white",
                                                        }}
                                                    >
                                                        <IconCheck stroke={2} />
                                                    </div>
                                                </div>
                                                <div>
                                                    <strong style={{ color: "#2c3e50" }}>Diagnoses</strong>
                                                    <p className="small mb-0" style={{ color: "#666" }}>
                                                        Diagnosis history
                                                    </p>
                                                </div>
                                            </div>
                                        </Col>

                                        <Col sm={6} md={4}>
                                            <div className="d-flex align-items-start gap-3">
                                                <div className="flex-shrink-0">
                                                    <div
                                                        className="d-flex align-items-center justify-content-center rounded-circle"
                                                        style={{
                                                            width: "40px",
                                                            height: "40px",
                                                            background:
                                                                "linear-gradient(135deg, rgba(13,110,253,0.95), rgba(102,16,242,0.95))",
                                                            color: "white",
                                                        }}
                                                    >
                                                        <IconCheck stroke={2} />
                                                    </div>
                                                </div>
                                                <div>
                                                    <strong style={{ color: "#2c3e50" }}>Online Access</strong>
                                                    <p className="small mb-0" style={{ color: "#666" }}>
                                                        Access from anywhere - protected by encryption and password
                                                    </p>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>

                                    <Row className="mt-5 pt-4" style={{ borderTop: "2px solid #e9ecef" }}>
                                        <Col xs={12}>
                                            <h3 className="h5 fw-semibold mb-3" style={{ color: "#2c3e50" }}>
                                                Repositories (GitHub)
                                            </h3>
                                        </Col>

                                        <Col md={4}>
                                            <div className="d-flex align-items-start gap-3">
                                                <div className="flex-shrink-0">
                                                    <div
                                                        className="d-flex align-items-center justify-content-center rounded-circle"
                                                        style={{
                                                            width: "40px",
                                                            height: "40px",
                                                            background:
                                                                "linear-gradient(135deg, rgba(13,110,253,0.95), rgba(102,16,242,0.95))",
                                                            color: "white",
                                                            fontWeight: 600,
                                                        }}
                                                    >
                                                        GH
                                                    </div>
                                                </div>
                                                <div>
                                                    <a
                                                        href="https://github.com/Gallus-Anonimus/LifeLink"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        style={{
                                                            color: "#2c3e50",
                                                            fontWeight: 600,
                                                            textDecoration: "none",
                                                        }}
                                                    >
                                                        Frontend
                                                    </a>
                                                    <p className="small mb-0" style={{ color: "#666" }}>
                                                        React + Bootstrap UI for the LifeLink application
                                                    </p>
                                                </div>
                                            </div>
                                        </Col>

                                        <Col md={4}>
                                            <div className="d-flex align-items-start gap-3">
                                                <div className="flex-shrink-0">
                                                    <div
                                                        className="d-flex align-items-center justify-content-center rounded-circle"
                                                        style={{
                                                            width: "40px",
                                                            height: "40px",
                                                            background:
                                                                "linear-gradient(135deg, rgba(13,110,253,0.95), rgba(102,16,242,0.95))",
                                                            color: "white",
                                                            fontWeight: 600,
                                                        }}
                                                    >
                                                        GH
                                                    </div>
                                                </div>
                                                <div>
                                                    <a
                                                        href="https://github.com/your-org/lifelink-backend"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        style={{
                                                            color: "#2c3e50",
                                                            fontWeight: 600,
                                                            textDecoration: "none",
                                                        }}
                                                    >
                                                        Backend
                                                    </a>
                                                    <p className="small mb-0" style={{ color: "#666" }}>
                                                        API, authentication and data storage
                                                    </p>
                                                </div>
                                            </div>
                                        </Col>

                                        <Col md={4}>
                                            <div className="d-flex align-items-start gap-3">
                                                <div className="flex-shrink-0">
                                                    <div
                                                        className="d-flex align-items-center justify-content-center rounded-circle"
                                                        style={{
                                                            width: "40px",
                                                            height: "40px",
                                                            background:
                                                                "linear-gradient(135deg, rgba(13,110,253,0.95), rgba(102,16,242,0.95))",
                                                            color: "white",
                                                            fontWeight: 600,
                                                        }}
                                                    >
                                                        GH
                                                    </div>
                                                </div>
                                                <div>
                                                    <a
                                                        href="https://github.com/VicExe0/lifelink-hw"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        style={{
                                                            color: "#2c3e50",
                                                            fontWeight: 600,
                                                            textDecoration: "none",
                                                        }}
                                                    >
                                                        Hardware
                                                    </a>
                                                    <p className="small mb-0" style={{ color: "#666" }}>
                                                        LifeLink device projects and firmware
                                                    </p>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>

                                    {/* New section: Team */}
                                    <Row className="mt-4">
                                        <Col xs={12}>
                                            <h3 className="h5 fw-semibold mb-3" style={{ color: "#2c3e50" }}>
                                                Team
                                            </h3>
                                        </Col>

                                        <Col md={6} lg={3} className="mb-3">
                                            <div className="d-flex align-items-start gap-3">
                                                <div>
                                                    <img
                                                        src="user-circle.svg"
                                                        alt="Member 1"
                                                        className="rounded-circle"
                                                        style={{
                                                            width: "56px",
                                                            height: "56px",
                                                            objectFit: "cover",
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 700, color: "#2c3e50" }}>
                                                        Szymon Hamera
                                                    </div>
                                                    <div className="small" style={{ color: "#666" }}>
                                                        Project Manager
                                                    </div>
                                                </div>
                                            </div>
                                        </Col>

                                        <Col md={6} lg={3} className="mb-3">
                                            <div className="d-flex align-items-start gap-3">
                                                <div>
                                                    <img
                                                        src="user-circle.svg"
                                                        alt="Member 2"
                                                        className="rounded-circle"
                                                        style={{
                                                            width: "56px",
                                                            height: "56px",
                                                            objectFit: "cover",
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 700, color: "#2c3e50" }}>
                                                        Marcin Kowalczyk
                                                    </div>
                                                    <div className="small" style={{ color: "#666" }}>
                                                        Backend Developer
                                                    </div>
                                                </div>
                                            </div>
                                        </Col>

                                        <Col md={6} lg={3} className="mb-3">
                                            <div className="d-flex align-items-start gap-3">
                                                <div>
                                                    <img
                                                        src="user-circle.svg"
                                                        alt="Member 3"
                                                        className="rounded-circle"
                                                        style={{
                                                            width: "56px",
                                                            height: "56px",
                                                            objectFit: "cover",
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 700, color: "#2c3e50" }}>
                                                        Wiktor Cisowski
                                                    </div>
                                                    <div className="small" style={{ color: "#666" }}>
                                                        Hardware Developer
                                                    </div>
                                                </div>
                                            </div>
                                        </Col>

                                        <Col md={6} lg={3} className="mb-3">
                                            <div className="d-flex align-items-start gap-3">
                                                <div>
                                                    <img
                                                        src="user-circle.svg"
                                                        alt="Member 4"
                                                        className="rounded-circle"
                                                        style={{
                                                            width: "56px",
                                                            height: "56px",
                                                            objectFit: "cover",
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 700, color: "#2c3e50" }}>
                                                        Marcin Cioch
                                                    </div>
                                                    <div className="small" style={{ color: "#666" }}>
                                                        Frontend Developer
                                                    </div>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>

                                    <div
                                        className="mt-5 pt-4 text-center"
                                        style={{ borderTop: "2px solid #e9ecef" }}
                                    >
                                        <p className="mb-0" style={{ color: "#666" }}>
                                            <strong style={{ color: "#2c3e50" }}>LifeLink</strong> - Your
                                            medical record always within reach
                                        </p>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};







