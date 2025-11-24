import type {Address} from "../../../../context/types.ts";
import {useLanguage} from "../../../../context/LanguageContext.tsx";
import {t} from "../../../../assets/languages.ts";

type Props = {
    address: Address;
    onChange: (addr: Address) => void;
};

export const Addres = ({ address, onChange }: Props) => {
    const update = (patch: Partial<Address>) => onChange({ ...(address ?? {}), ...patch });
    const {lang} = useLanguage();

    return (
        <>
            <label className="form-label fw-semibold">{t("address.address",lang)}</label>
            <div className="row">
                <div className="col col-6">
                    <label className="form-label fw-semibold">{t("address.street")}</label>
                    <input
                        type="text"
                        className="form-control mb-2"
                        value={address?.street ?? ""}
                        onChange={(e) => update({ street: e.target.value })}
                    />
                </div>
                <div className="col col-6">
                    <label className="form-label fw-semibold">{t("address.country",lang)}</label>
                    <input
                        type="text"
                        className="form-control mb-2"
                        value={address?.country ?? ""}
                        onChange={(e) => update({ country: e.target.value })}
                    />
                </div>
            </div>
            <div className="row">
                <div className="col-6">
                    <label className="form-label fw-semibold">{t("address.city",lang)}</label>
                    <input
                        type="text"
                        className="form-control"
                        value={address?.city ?? ""}
                        onChange={(e) => update({ city: e.target.value })}
                    />
                </div>
                <div className="col-3">
                    <label className="form-label fw-semibold">{t("address.postalCode",lang)}</label>
                    <input
                        type="text"
                        className="form-control"
                        value={address?.postalCode ?? ""}
                        onChange={(e) => update({ postalCode: e.target.value })}
                    />
                </div>
                <div className="col-3">
                    <label className="form-label fw-semibold">{t("address.buildingNumber",lang)}</label>
                    <input
                        type="text"
                        className="form-control"
                        value={address?.buildingNumber ?? ""}
                        onChange={(e) => update({ buildingNumber: e.target.value })}
                    />
                </div>
            </div>
        </>
    );
};