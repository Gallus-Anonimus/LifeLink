import { useLanguage } from "../../../context/LanguageContext.tsx";
import { t } from "../../../assets/languages.ts";
import type { Rozpoznanie } from "../types.ts";

interface DiagnosesListProps {
    rozpoznania: Rozpoznanie[];
}

const DiagnosesList = ({ rozpoznania }: DiagnosesListProps) => {
    const { lang } = useLanguage();

    return (
        <div className="card mb-4">
            <div className="card-header bg-dark text-white">
                <h4 className="mb-0">{t("medicalcard.diagnoses", lang)}</h4>
            </div>
            <div className="card-body">
                {rozpoznania.length > 0 ? (
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>{t("medicalcard.icd_code", lang)}</th>
                                    <th>{t("medicalcard.description", lang)}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rozpoznania.map((rozpoznanie) => (
                                    <tr key={rozpoznanie.id_rozpoznania}>
                                        <td><strong>{rozpoznanie.kod_icd}</strong></td>
                                        <td>{rozpoznanie.opis || "-"}</td>
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

export default DiagnosesList;

