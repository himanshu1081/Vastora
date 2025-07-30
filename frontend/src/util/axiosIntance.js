import axios from "axios"

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000/api/v1',
    withCredentials: true,
    proxy: false
});

export default axiosInstance