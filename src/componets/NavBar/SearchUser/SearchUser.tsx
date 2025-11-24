import React from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { t } from "../../../assets/languages.ts";
import { useLanguage } from "../../../context/LanguageContext.tsx";

const SearchUser: React.FC = () => {
    const { lang } = useLanguage();

    return (
        <Form>
            <Row>
                <Col xs="auto">
                    <Form.Control
                        type="text"
                        placeholder={t("search.user", lang)}
                        className="mr-sm-2"
                    />
                </Col>
                <Col xs="auto">
                    <Button type="submit">{t("button.submit", lang)}</Button>
                </Col>
            </Row>
        </Form>
    );
};

export default SearchUser;