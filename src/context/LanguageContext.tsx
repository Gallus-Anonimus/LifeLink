import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";
import type { Lang } from "../assets/languages.ts";

type LanguageContextValue = {
    lang: Lang;
    setLang: (lang: Lang) => void;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const COOKIE_NAME = "language";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

const readCookie = (): Lang | undefined => {
    if (typeof document === "undefined") return undefined;
    const entry = document.cookie
        .split(";")
        .map((c) => c.trim())
        .find((c) => c.startsWith(`${COOKIE_NAME}=`));
    const value = entry?.split("=")[1];
    return value === "pl" || value === "en" ? value : undefined;
};

const writeCookie = (value: Lang) => {
    if (typeof document === "undefined") return;
    document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=${COOKIE_MAX_AGE}`;
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [lang, setLangState] = useState<Lang>(() => readCookie() ?? "en");

    useEffect(() => {
        const saved = readCookie();
        if (saved && saved !== lang) {
            setLangState(saved);
        }
    }, [lang]);

    const setLang = useCallback((next: Lang) => {
        setLangState(next);
        writeCookie(next);
    }, []);

    const value = useMemo(
        () => ({
            lang,
            setLang,
        }),
        [lang, setLang],
    );

    return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
    const ctx = useContext(LanguageContext);
    if (!ctx) {
        throw new Error("useLanguage must be used within LanguageProvider");
    }
    return ctx;
};

