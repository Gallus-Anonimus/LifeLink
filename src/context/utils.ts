import {baseURL} from "../assets/const.ts";
import { DateTime } from "luxon";


export  const fetchApi = async (method: string, path: string, options: RequestInit = {}) => {
    const url = `${baseURL}${path}`;
    const config: RequestInit = {
        method: method,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options,
    };
    return fetch(url, config);
}

export const fetchSesion = async (setLoggedIn:any) => {
    fetchApi("GET", "/auth/session-status").then(res => {
        return res.json()
    }).then(
        data => {
            setLoggedIn(data.active);
        }
    )
}

export const changeDate = (dateString: string): string => {
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
}

export const reverseDate = (dateString: string): string => {
    if (!dateString) return '';
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const [year, month, day] = dateString.split('-');
        if (year && year.length === 4 && year.startsWith('0')) {
            const fixedYear = '2' + year.substring(1);
            return `${fixedYear}-${month}-${day}`;
        }
        return dateString;
    }
    if (dateString.match(/^\d{2}-\d{2}-\d{4}$/)) {
        const [day, month, year] = dateString.split('-');
        return `${year}-${month}-${day}`;
    }
    if (dateString.match(/^\d{2}\.\d{2}\.\d{4}$/)) {
        const [day, month, year] = dateString.split('.');
        return `${year}-${month}-${day}`;
    }

    return dateString;
}

export const registerNfcTag = async (nfcTagUid: string, nfcCode: string) => {
    const url = `${baseURL}/auth/nfc/register`;
    try {
        const response = await fetchApi("PATCH", "/auth/nfc/register", {
            body: JSON.stringify({
                nfcTagUid,
                nfcCode
            })
        });
        return response;
    } catch (error) {
        console.error("Failed to register NFC tag:", error);
        console.error("Request URL:", url);
        throw error;
    }
}

export const deregisterNfcTag = async () => {
    try {
        const response = await fetchApi("PATCH", "/auth/nfc/deregister", {});
        return response;
    } catch (error) {
        console.error("Failed to deregister NFC tag:", error);
        throw error;
    }
}


export const toUtcTime = (localTime: string): string =>
    DateTime.fromFormat(localTime, "HH:mm", {
        zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    })
        .toUTC()
        .toFormat("HH:mm");

export const toLocalTime = (utcTime: string): string =>
    DateTime.fromFormat(utcTime, "HH:mm:ss", { zone: "utc" })
        .setZone(Intl.DateTimeFormat().resolvedOptions().timeZone)
        .toFormat("HH:mm");


