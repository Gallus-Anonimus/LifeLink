import { useLanguage } from "../../../context/LanguageContext.tsx";
import { t } from "../../../assets/languages.ts";
import type { Badanie } from "../types.ts";
import { formatDate } from "../utils.ts";

interface ExaminationsListProps {
    badania: Badanie[];
}

const ExaminationsList = ({ badania }: ExaminationsListProps) => {
    const { lang } = useLanguage();

    return (
        <div className="card mb-4">
            <div className="card-header bg-secondary text-white">
                <h4 className="mb-0">{t("medicalcard.examinations", lang)}</h4>
            </div>
            <div className="card-body">
                {badania.length > 0 ? (
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>{t("medicalcard.examination_type", lang)}</th>
                                    <th>{t("medicalcard.examination_date", lang)}</th>
                                    <th>{t("medicalcard.result", lang)}</th>
                                    <th>{t("medicalcard.result_file", lang)}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {badania.map((badanie) => (
                                    <tr key={badanie.id_badania}>
                                        <td><strong>{badanie.typ_badania}</strong></td>
                                        <td>{formatDate(badanie.data_badania, lang)}</td>
                                        <td>{badanie.wynik || "-"}</td>
                                        <td>
                                            {badanie.plik_wyniku ? (
                                                <a href={badanie.plik_wyniku} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">
                                                    {t("medicalcard.result_file", lang)}
                                                </a>
                                            ) : (
                                                "-"
                                            )}
                                        </td>
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

export default ExaminationsList;

