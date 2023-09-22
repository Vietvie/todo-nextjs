import axiosClient from './axiosClient';

const todoApi = {
    getTodo() {
        return axiosClient.get('/todo');
    },
    myTodo() {
        const baseURL = '/todo/mytodo';
        return axiosClient.get(baseURL);
    },
    addNewTodo(data: {
        name: string;
        create_time: number;
        deadline_time: number;
        process_by_id: number;
    }) {
        const baseURL = '/todo';
        return axiosClient.post(baseURL, data);
    },
};

export default todoApi;
