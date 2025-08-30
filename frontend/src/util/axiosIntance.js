import axios from "axios"
import store from "src/app/store.js"

const axiosInstance = axios.create({
    baseURL: 'https://vastora.onrender.com/api/v1',
    withCredentials: true,
    proxy: false
});

axiosInstance.interceptors.request.use((config) => {
    const token = store.getState().auth.token; // read token from Redux
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosInstance