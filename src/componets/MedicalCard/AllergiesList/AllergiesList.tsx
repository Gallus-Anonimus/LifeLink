import { useLanguage } from "../../../context/LanguageContext.tsx";
import { t } from "../../../assets/languages.ts";
import type { Alergia } from "../types.ts";

interface AllergiesListProps {
    alergie: Alergia[];
}

const AllergiesList = ({ alergie }: AllergiesListProps) => {
    const { lang } = useLanguage();

    return (
        <div className="card mb-4">
            <div className="card-header text-white" style={{ backgroundColor: "#d1326a" }}>
                <h4 className="mb-0">{t("medicalcard.allergies", lang)}</h4>
            </div>
            <div className="card-body">
                {alergie.length > 0 ? (
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>{t("medicalcard.allergy_name", lang)}</th>
                                    <th>{t("medicalcard.description", lang)}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {alergie.map((alergia) => (
                                    <tr key={alergia.id_alergii}>
                                        <td><strong>{alergia.nazwa}</strong></td>
                                        <td>{alergia.opis || "-"}</td>
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

export default AllergiesList;

