import axiosClient from './axiosClient';

const userApi = {
    getAllUser() {
        const baseURL = '/user';
        return axiosClient.get(baseURL);
    },
    getMe() {
        const baseURL = '/user/me';
        return axiosClient.get(baseURL);
    },
};

export default userApi;
