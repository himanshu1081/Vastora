import axios from "axios"

const axiosInstance = axios.create({
    baseURL: 'https://vastora.onrender.com/api/v1',
    withCredentials: true,
    proxy: false
});

export default axiosInstance