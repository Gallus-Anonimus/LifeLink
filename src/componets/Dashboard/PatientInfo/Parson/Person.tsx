import type { Person as PersonType } from "../../../../context/types.ts";
import {t} from "../../../../assets/languages.ts";
import {useLanguage} from "../../../../context/LanguageContext.tsx";

type Props = {
    person: PersonType | null | undefined;
    onChange: (person: PersonType) => void;
};

export const Person = ({ person, onChange }: Props) => {
    const {lang} = useLanguage();

    if (person == null) {
        return null;
    }

    const update = (patch: Partial<PersonType>) =>
        onChange({ ...person, ...patch });

    return (
        <>
            <div className="row">
                <div className="col-6">
                    <label className="form-label fw-semibold">{t("form.FistName",lang)}</label>
                    <input
                        type="text"
                        className="form-control mb-2"
                        value={person.firstName ?? ""}
                        onChange={(e) => update({ firstName: e.target.value })}
                    />
                </div>

                <div className="col-6">
                    <label className="form-label fw-semibold">{t("form.MiddleName",lang)}</label>
                    <input
                        type="text"
                        className="form-control mb-2"
                        value={person.middleName ?? ""}
                        onChange={(e) => update({ middleName: e.target.value })}
                    />
                </div>
            </div>

            <div className="row">
                <div className="col-6">
                    <label className="form-label fw-semibold">{t("form.LastName",lang)}</label>
                    <input
                        type="text"
                        className="form-control mb-2"
                        value={person.lastName ?? ""}
                        onChange={(e) => update({ lastName: e.target.value })}
                    />
                </div>

                <div className="col-6">
                    <label className="form-label fw-semibold">{t("form.Gender",lang)}</label>
                    <select 
                        className="form-select"
                        value={person.gender}
                        onChange={(e) => update({ gender: e.target.value as "MALE" | "FEMALE" })}
                    >
                        <option value="MALE">{t("form.male",lang)}</option>
                        <option value="FEMALE">{t("form.female",lang)}</option>
                    </select>
                </div>
            </div>

            <div className="row">
                <div className="col-6">
                    <label className="form-label fw-semibold">{t("form.telephone",lang)}</label>
                    <input
                        type="text"
                        className="form-control mb-2"
                        value={person.phoneNumber ?? ""}
                        onChange={(e) => update({ phoneNumber: e.target.value })}
                    />
                </div>
            </div>


        </>
    );
};

export default Person;
