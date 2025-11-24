import Languages from "./Languages/Languages.tsx";
// import SearchUser from "./SearchUser/SearchUser.tsx";
import { useLanguage } from "../../context/LanguageContext.tsx";
import { t } from "../../assets/languages.ts";
import UserMenu from "./UserMenu/UserMenu.tsx";

const NavBar = () => {
    const { lang } = useLanguage();

    return (
        <>
            <div className="bg-body-secondary justify-content-between row mt-3 p-3 align-items-center">
                <section className="col-4">
                    <Languages />
                </section>
                <section className="col-4 text-center fw-semibold ">
                    {t("app.title", lang)}
                </section>
                <section className="col-4 d-flex justify-content-end">
                    <UserMenu />
                </section>
            </div>
        </>
    );
};

export default NavBar;