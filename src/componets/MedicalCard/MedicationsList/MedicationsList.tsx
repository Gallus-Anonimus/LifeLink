import { useLanguage } from "../../../context/LanguageContext.tsx";
import { t } from "../../../assets/languages.ts";
import type { Lek } from "../types.ts";
import { formatDate } from "../utils.ts";

interface MedicationsListProps {
    leki: Lek[];
}

const MedicationsList = ({ leki }: MedicationsListProps) => {
    const { lang } = useLanguage();

    return (
        <div className="card mb-4">
            <div className="card-header bg-info text-white">
                <h4 className="mb-0">{t("medicalcard.medications", lang)}</h4>
            </div>
            <div className="card-body">
                {leki.length > 0 ? (
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>{t("medicalcard.medication_name", lang)}</th>
                                    <th>{t("medicalcard.dose", lang)}</th>
                                    <th>{t("medicalcard.frequency", lang)}</th>
                                    <th>{t("medicalcard.from_date", lang)}</th>
                                    <th>{t("medicalcard.to_date", lang)}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leki.map((lek) => (
                                    <tr key={lek.id_leku}>
                                        <td><strong>{lek.nazwa}</strong></td>
                                        <td>{lek.dawka}</td>
                                        <td>{lek.czestotliwosc}</td>
                                        <td>{formatDate(lek.od_kiedy, lang)}</td>
                                        <td>{lek.do_kiedy ? formatDate(lek.do_kiedy, lang) : t("medicalcard.to_date", lang) + " -"}</td>
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

export default MedicationsList;

