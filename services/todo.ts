import axiosClient from './axiosClient';

const todoApi = {
    getTodo() {
        return axiosClient.get('/todo');
    },
    getTodoDetail(id: number | string) {
        const baseURL = `/todo/${id}`;
        return axiosClient.get(baseURL);
    },
    myTodo() {
        const baseURL = '/todo/mytodo';
        return axiosClient.get(baseURL);
    },
    addNewTodo(data: {
        name: string;
        create_time: number;
        deadline_time: number;
        process_by_id: (number | string)[];
    }) {
        const baseURL = '/todo';
        return axiosClient.post(baseURL, data);
    },
    updateAssigness(id: number, data: { processBy: (number | string)[] }) {
        const baseURL = `todo/${id}`;
        return axiosClient.put(baseURL, data);
    },
    deleteTodo(id: number) {
        const baseURL = `todo/${id}`;
        return axiosClient.delete(baseURL);
    },
    changeDeadline(id: number, data: { deadlineTime: number }) {
        const baseURL = `todo/${id}`;
        return axiosClient.put(baseURL, data);
    },
    updateTodo(
        id: number,
        data: {
            deadlineTime?: number;
            status?: string | number;
            processBy?: number[];
            taskName?: string;
        }
    ) {
        const baseURL = `todo/${id}`;
        return axiosClient.put(baseURL, data);
    },
};

export default todoApi;
