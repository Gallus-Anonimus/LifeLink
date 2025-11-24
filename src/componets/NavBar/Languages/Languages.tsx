import Lang from "./Lang/Lang.tsx";
import { useLanguage } from "../../../context/LanguageContext.tsx";

const Languages = () => {
    const { lang, setLang } = useLanguage();

    return (
        <>
            <div className="row">
                <div className="col-6">
                    <Lang
                        flag="GB"
                        description="English"
                        active={lang === "en"}
                        onClick={() => setLang("en")}
                    />
                </div>
                <div className="col-6">
                    <Lang
                        flag="PL"
                        description="Polish"
                        active={lang === "pl"}
                        onClick={() => setLang("pl")}
                    />
                </div>
            </div>
        </>
    );
};

export default Languages;