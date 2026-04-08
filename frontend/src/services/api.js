import axios from 'axios';
import { toast } from 'react-hot-toast';

const api = axios.create({
    baseURL: 'http://localhost:8081'
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

api.interceptors.response.use(
    response => response,
    error => {
        const message = error.response?.data?.message || 'Something went wrong';
        toast.error(message);
        return Promise.reject(error);
    }
);

export default api;
