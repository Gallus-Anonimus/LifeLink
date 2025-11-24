import { useLanguage } from "../../../context/LanguageContext.tsx";
import { t } from "../../../assets/languages.ts";
import type { Szczepienie } from "../types.ts";
import { formatDate } from "../utils.ts";

interface VaccinationsListProps {
    szczepienia: Szczepienie[];
}

const VaccinationsList = ({ szczepienia }: VaccinationsListProps) => {
    const { lang } = useLanguage();

    return (
        <div className="card mb-4">
            <div className="card-header bg-success text-white">
                <h4 className="mb-0">{t("medicalcard.vaccinations", lang)}</h4>
            </div>
            <div className="card-body">
                {szczepienia.length > 0 ? (
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>{t("medicalcard.vaccination_name", lang)}</th>
                                    <th>{t("medicalcard.vaccination_date", lang)}</th>
                                    <th>{t("medicalcard.dose_number", lang)}</th>
                                    <th>{t("medicalcard.notes", lang)}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {szczepienia.map((szczepienie) => (
                                    <tr key={szczepienie.id_szczepienia}>
                                        <td><strong>{szczepienie.nazwa}</strong></td>
                                        <td>{formatDate(szczepienie.data_szczepienia, lang)}</td>
                                        <td>{szczepienie.dawka_nr}</td>
                                        <td>{szczepienie.uwagi || "-"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-muted mb-0">{t("medicalcard.no_data", lang)}</p>
                )}
            </div>
        </div>
    );
};

export default VaccinationsList;

