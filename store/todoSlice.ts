import TodoState from '@/models/TodoState';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface TodoTemplate
    extends Omit<TodoState, 'id' | 'createTime' | 'status'> {}

const initialState: TodoState[] = [];
const todoSlice = createSlice({
    name: 'todo',
    initialState,
    reducers: {
        addTodo: (state, action: PayloadAction<TodoTemplate>) => {
            state = [
                ...state,
                {
                    ...action.payload,
                    id: Date.now(),
                    createTime: Date.now(),
                    status: 'pending',
                },
            ];
            return state;
        },
        removeTodo: (state, action: PayloadAction<number>) => {
            return state.filter((el) => el.id !== action.payload);
        },
        updateStatus(
            state,
            action: PayloadAction<{ id: number; status: string }>
        ) {
            return state.map((el) => {
                if (el.id === action.payload.id) {
                    return { ...el, status: action.payload.status };
                }
                return el;
            });
        },
        updateProcessUser(
            state,
            action: PayloadAction<{ id: number; newUserProcess: string }>
        ) {
            return state.map((el) => {
                if (el.id === action.payload.id) {
                    return { ...el, processBy: action.payload.newUserProcess };
                }
                return el;
            });
        },
        openEditTaskName(state, action: PayloadAction<number>) {
            return state.map((el) => {
                if (el.id === action.payload) {
                    return {
                        ...el,
                        name: {
                            value: el.name.value,
                            editing: true,
                        },
                    };
                }
                return el;
            });
        },
        updateTaskName(
            state,
            action: PayloadAction<{ id: number; newTaskName: string }>
        ) {
            return state.map((el) => {
                if (el.id === action.payload.id) {
                    return {
                        ...el,
                        name: {
                            value: action.payload.newTaskName,
                            editing: false,
                        },
                    };
                }
                return el;
            });
        },
        updateDeadline(
            state,
            action: PayloadAction<{ id: number; newDeadline: number }>
        ) {
            return state.map((el) => {
                if (el.id === action.payload.id) {
                    return { ...el, deadlineTime: action.payload.newDeadline };
                }
                return el;
            });
        },
    },
});

const todoAction = todoSlice.actions;
const todoReducer = todoSlice.reducer;

export default todoReducer;
export { todoAction };
