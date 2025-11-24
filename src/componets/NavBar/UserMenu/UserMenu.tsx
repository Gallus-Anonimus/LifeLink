import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
    IconUserCircle,
    IconLayoutDashboard,
    IconLogin,
    IconLogout,
    IconUserPlus,
} from "@tabler/icons-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "../../../context/LanguageContext.tsx";
import { t } from "../../../assets/languages.ts";
import {fetchApi} from "../../../context/utils.ts";

const menuContainerStyle: CSSProperties = {
    minWidth: "14rem",
    zIndex: 20,
};

const UserMenu = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { lang } = useLanguage();
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open]);

    useEffect(() => {
        setOpen(false);
    }, [location.pathname]);

    const toggleMenu = () => setOpen((prev) => !prev);

    const menuItems = [
        {
            key: "dashboard",
            label: t("nav.menu.dashboard", lang),
            icon: IconLayoutDashboard,
            action: () => navigate("/dashboard"),
        },
        {
            key: "login",
            label: t("nav.menu.login", lang),
            icon: IconLogin,
            action: () => navigate("/login"),
        },
        {
            key: "logout",
            label: t("nav.menu.logout", lang),
            icon: IconLogout,
            action: () => fetchApi("POST", "/auth/logout").then(() => navigate("/login")),
        },
        {
            key: "register",
            label: t("nav.menu.register", lang),
            icon: IconUserPlus,
            action: () => navigate("/register"),
        },
    ];

    return (
        <div className="d-flex justify-content-end" ref={menuRef}>
            <div className="position-relative">
                <button
                    className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center p-2"
                    type="button"
                    aria-label={t("nav.menu.profile", lang)}
                    onClick={toggleMenu}
                >
                    <IconUserCircle size={28} />
                </button>
                {open && (
                    <div
                        className="position-absolute end-0 mt-2 bg-white shadow rounded-3 py-2 border"
                        style={menuContainerStyle}
                    >
                        {menuItems.map((item) => {
                            const ItemIcon = item.icon;
                            return (
                                <button
                                    key={item.key}
                                    type="button"
                                    className="dropdown-item d-flex align-items-center gap-2 py-2 mx-3"
                                    onClick={item.action}
                                >
                                    <ItemIcon size={18} />
                                    <span className="text-start flex-grow-1">{item.label}</span>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserMenu;

