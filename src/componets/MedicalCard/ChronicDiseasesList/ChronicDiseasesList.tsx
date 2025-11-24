import { useLanguage } from "../../../context/LanguageContext.tsx";
import { t } from "../../../assets/languages.ts";
import type { ChorobaPrzewlekla } from "../types.ts";
import { formatDate } from "../utils.ts";

interface ChronicDiseasesListProps {
    choroby_przewlekle: ChorobaPrzewlekla[];
}

const ChronicDiseasesList = ({ choroby_przewlekle }: ChronicDiseasesListProps) => {
    const { lang } = useLanguage();

    return (
        <div className="card mb-4">
            <div className="card-header bg-warning text-dark">
                <h4 className="mb-0">{t("medicalcard.chronic_diseases", lang)}</h4>
            </div>
            <div className="card-body">
                {choroby_przewlekle.length > 0 ? (
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>{t("medicalcard.disease_name", lang)}</th>
                                    <th>{t("medicalcard.diagnosis_date", lang)}</th>
                                    <th>{t("medicalcard.notes", lang)}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {choroby_przewlekle.map((choroba) => (
                                    <tr key={choroba.id_choroby}>
                                        <td><strong>{choroba.nazwa}</strong></td>
                                        <td>{formatDate(choroba.data_rozpoznania, lang)}</td>
                                        <td>{choroba.uwagi || "-"}</td>
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

export default ChronicDiseasesList;

