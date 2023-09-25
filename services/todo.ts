import axiosClient from './axiosClient';

const todoApi = {
    getTodo() {
        return axiosClient.get('/todo');
    },
    getTodoDetail(id: number | string) {
        const baseURL = `/todo/${id}`;
        return axiosClient.get(baseURL);
    },
    myTodo(data?: { [key: string]: string | number }) {
        let query: string = '';
        if (data && Object.keys(data).length > 0) {
            query = Object.keys(data)
                .map((el) => `${el}=${data[el]}`)
                .join('&');
        }
        const baseURL = `/todo/mytodo?` + query;
        console.log(baseURL);
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
