import { useLanguage } from "../../../context/LanguageContext.tsx";
import { t } from "../../../assets/languages.ts";
import type { Zabieg } from "../types.ts";
import { formatDate } from "../utils.ts";

interface ProceduresListProps {
    zabiegi: Zabieg[];
}

const ProceduresList = ({ zabiegi }: ProceduresListProps) => {
    const { lang } = useLanguage();

    return (
        <div className="card mb-4">
            <div className="card-header" style={{ backgroundColor: "#6f42c1", color: "white" }}>
                <h4 className="mb-0">{t("medicalcard.procedures", lang)}</h4>
            </div>
            <div className="card-body">
                {zabiegi.length > 0 ? (
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>{t("medicalcard.procedure_code", lang)}</th>
                                    <th>{t("medicalcard.procedure_date", lang)}</th>
                                    <th>{t("medicalcard.description", lang)}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {zabiegi.map((zabieg) => (
                                    <tr key={zabieg.id_zabiegu}>
                                        <td><strong>{zabieg.kod_procedury}</strong></td>
                                        <td>{formatDate(zabieg.data_zabiegu, lang)}</td>
                                        <td>{zabieg.opis || "-"}</td>
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

export default ProceduresList;

