import axiosClient from './axiosClient';

const userTodoApi = {
    deleteAssignedUser(data: { user_id: number | string; todo_id: number }) {
        const baseURL = '/user-todo';
        return axiosClient.patch(baseURL, data);
    },
};

export default userTodoApi;
