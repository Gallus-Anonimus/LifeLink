import { useEffect, useRef, useState } from "react";
import { IconMenu2, IconNfc } from "@tabler/icons-react";
import Languages from "./Languages/Languages.tsx";
import NfcScanner from "./NfcScanner/NfcScanner.tsx";

import { useLanguage } from "../../context/LanguageContext.tsx";
import { t } from "../../assets/languages.ts";
import UserMenu from "./UserMenu/UserMenu.tsx";
import logo from "../../assets/logo.png";

const mobileMenuStyles = {
    minWidth: "12rem",
    zIndex: 30,
};

const NavBar = () => {
    const { lang } = useLanguage();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [nfcModalOpen, setNfcModalOpen] = useState(false);
    const mobileMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
                setMobileMenuOpen(false);
            }
        };

        if (mobileMenuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [mobileMenuOpen]);

    return (
        <>
            <div className="bg-body-secondary justify-content-between row mt-3 p-3 align-items-center gx-3">
                <section className="col-12 col-md-4 d-none d-md-block">
                    <Languages />
                </section>  
                <section className="col-6 col-md-4 text-center text-md-center fw-semibold">
                    <img src={logo} alt="logo" style={{ height: "100px" }} />
                </section>
                <section className="col-6 col-md-4 d-flex justify-content-end align-items-center gap-2 flex-wrap flex-md-nowrap">
                    <button
                        className="btn btn-outline-primary d-none d-lg-flex align-items-center justify-content-center gap-2"
                        type="button"
                        aria-label={t("nav.menu.nfc", lang)}
                        onClick={() => setNfcModalOpen(true)}
                    >
                        <IconNfc size={20} />
                        <span className="d-none d-xl-inline">{t("nav.menu.nfc", lang)}</span>
                    </button>
                    <div className="d-md-none position-relative" ref={mobileMenuRef}>
                        <button
                            className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center p-2"
                            type="button"
                            aria-label={t("nav.menu.profile", lang)}
                            aria-expanded={mobileMenuOpen}
                            onClick={() => setMobileMenuOpen((prev) => !prev)}
                        >
                            <IconMenu2 size={24} />
                        </button>
                        {mobileMenuOpen && (
                            <div className="position-absolute end-0 mt-2 bg-white border rounded-3 shadow p-2" style={mobileMenuStyles}>
                                <Languages className="g-2" onAfterSelect={() => setMobileMenuOpen(false)} />
                            </div>
                        )}
                    </div>
                    <UserMenu onNfcClick={() => setNfcModalOpen(true)} />
                </section>
                <NfcScanner isOpen={nfcModalOpen} onClose={() => setNfcModalOpen(false)} />
            </div>
        </>
    );
};

export default NavBar;