import Lang from "./Lang/Lang.tsx";
import { useLanguage } from "../../../context/LanguageContext.tsx";
import type { Lang as LanguageCode } from "../../../assets/languages.ts";

type LanguagesProps = {
    className?: string;
    onAfterSelect?: () => void;
};

const Languages = ({ className = "", onAfterSelect }: LanguagesProps) => {
    const { lang, setLang } = useLanguage();

    const handleSelect = (nextLang: LanguageCode) => {
        setLang(nextLang);
        onAfterSelect?.();
    };

    return (
        <>
            <div className={`row ${className}`.trim()}>
                <div className="col-6">
                    <Lang
                        flag="GB"
                        description="English"
                        active={lang === "en"}
                        onClick={() => handleSelect("en")}
                    />
                </div>
                <div className="col-6">
                    <Lang
                        flag="PL"
                        description="Polish"
                        active={lang === "pl"}
                        onClick={() => handleSelect("pl")}
                    />
                </div>
            </div>
        </>
    );
};

export default Languages;