import {baseURL} from "../assets/const.ts";

export  const fetchApi = async (method: string, path: string, options: RequestInit = {}) => {
    return fetch(`${baseURL}${path}`, {
        method: method,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options,
    });
}

export const fetchSesion = async (setLoggedIn:any) => {
    fetchApi("GET", "/auth/session-status").then(res => {
        return res.json()
    }).then(
        data => {
            setLoggedIn(data.active);
            console.log(data)
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


