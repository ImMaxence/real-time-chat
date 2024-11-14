import axios from 'axios';
import { logOut } from './authService';

export const api = axios.create({
    baseURL: process.env.REACT_APP_URL_BACK,
    withCredentials: true,
});

api.interceptors.request.use(
    async (config) => {
        console.log("[API SERVICE FRONT] : 🚀 - Request...");
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => {
        console.log("[API SERVICE FRONT] : 👮‍♂️ - Good");
        return response;
    },
    (error) => {
        console.log("[API SERVICE FRONT] : ❌ - Problem token or error, log out...");
        // logOut()
        return Promise.reject(error.response.data.message);
    }
);

export default api;
