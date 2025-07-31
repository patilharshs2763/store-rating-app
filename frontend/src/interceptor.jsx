import axios from 'axios';

import { toast } from 'react-toastify';

const client = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

client.interceptors.request.use((config) => {
    const idToken = localStorage.getItem('token');
    config.headers["X-ID-TOKEN"] = idToken;
    config.timeout = 60000;

    return config;
});

client.interceptors.response.use(
    (res) => res,
    async (error) => {
        const status = error?.response?.status ?? null;

        switch (status) {
            case 401:
            case 403:
                localStorage.clear();
                localStorage.removeItem('refreshToken');
                window.location.replace('/login');
                break;
            case 502:
                toast.error("Bad Gateway!", { autoClose: 2000 });
                break;
        }

        if (status === 401 || status === 403) {
            localStorage.removeItem("access");
            localStorage.removeItem("refreshToken");
            window.location.replace('/');
        }
        return Promise.reject(error);
    }
);

export default client;
