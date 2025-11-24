import type { Lang } from "../../assets/languages.ts";

export const formatDate = (dateString: string, lang: Lang = "en"): string => {
    if (!dateString) return "-";
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString(lang === "pl" ? "pl-PL" : "en-US");
    } catch {
        return dateString;
    }
};

