import { useLanguage } from "../../../context/LanguageContext.tsx";
import { t } from "../../../assets/languages.ts";
import type { Pacjent } from "../types.ts";
import { formatDate } from "../utils.ts";

interface PatientInfoProps {
    pacjent: Pacjent;
}

const PatientInfo = ({ pacjent }: PatientInfoProps) => {
    const { lang } = useLanguage();

    return (
        <div className="card mb-4">
            <div className="card-header bg-primary text-white">
                <h3 className="mb-0">{t("medicalcard.patient_info", lang)}</h3>
            </div>
            <div className="card-body">
                <div className="row">
                    <div className="col-md-6">
                        <h5 className="text-muted mb-3">{t("medicalcard.personal_data", lang)}</h5>
                        <table className="table table-borderless">
                            <tbody>
                                <tr>
                                    <th scope="row" style={{ width: "40%" }}>{t("medicalcard.patient_id", lang)}:</th>
                                    <td>{pacjent.id_pacjenta}</td>
                                </tr>
                                <tr>
                                    <th scope="row">{t("medicalcard.first_name", lang)}:</th>
                                    <td>{pacjent.imie || "-"}</td>
                                </tr>
                                <tr>
                                    <th scope="row">{t("medicalcard.last_name", lang)}:</th>
                                    <td>{pacjent.nazwisko || "-"}</td>
                                </tr>
                                <tr>
                                    <th scope="row">{t("medicalcard.pesel", lang)}:</th>
                                    <td>{pacjent.pesel || "-"}</td>
                                </tr>
                                <tr>
                                    <th scope="row">{t("medicalcard.birth_date", lang)}:</th>
                                    <td>{formatDate(pacjent.data_urodzenia, lang)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="col-md-6">
                        <h5 className="text-muted mb-3">{t("medicalcard.contact_info", lang)}</h5>
                        <table className="table table-borderless">
                            <tbody>
                                <tr>
                                    <th scope="row" style={{ width: "40%" }}>{t("medicalcard.phone", lang)}:</th>
                                    <td>{pacjent.telefon || "-"}</td>
                                </tr>
                                <tr>
                                    <th scope="row">{t("medicalcard.address", lang)}:</th>
                                    <td>{pacjent.adres || "-"}</td>
                                </tr>
                                <tr>
                                    <th scope="row">{t("medicalcard.contact_person", lang)}:</th>
                                    <td>{pacjent.osoba_kontaktowa || "-"}</td>
                                </tr>
                                <tr>
                                    <th scope="row">{t("medicalcard.contact_phone", lang)}:</th>
                                    <td>{pacjent.telefon_kontaktowy || "-"}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientInfo;

