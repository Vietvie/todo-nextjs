import axios, { AxiosRequestHeaders, InternalAxiosRequestConfig } from 'axios';

const baseURL = '/api';

const axiosClient = axios.create({
    baseURL,
});

axiosClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers = {
            ...(config.headers as AxiosRequestHeaders['headers']),
            Authorization: 'Bearer ' + token,
        };
    }
    return config;
});

export default axiosClient;
