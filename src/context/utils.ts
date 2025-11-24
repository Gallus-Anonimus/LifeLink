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


