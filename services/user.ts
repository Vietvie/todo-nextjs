import axiosClient from './axiosClient';

const userApi = {
    getAllUser() {
        const baseURL = '/user';
        return axiosClient.get(baseURL);
    },
};

export default userApi;
