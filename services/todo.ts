import axios from 'axios';

const todoServices = {
    getTodo() {
        return axios.get<{ message: string }>('/');
    },
};

export default todoServices;
