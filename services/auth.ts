import axiosClient from './axiosClient';

const authApi = {
    signup(data: { email: string; password: string; name: string }) {
        const baseURL = '/auth/signup';
        return axiosClient.post(baseURL, data);
    },
    login(data: { email: string; password: string }) {
        const baseURL = '/auth/login';
        return axiosClient.post(baseURL, data);
    },
};

export default authApi;
