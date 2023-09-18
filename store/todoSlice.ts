import TodoState from '@/models/TodoState';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const initialState: TodoState[] = [];
const todoSlice = createSlice({
    name: 'todo',
    initialState,
    reducers: {
        addTodo: (state, action: PayloadAction<TodoState>) => {
            return [...state, action.payload];
        },
        removeTodo: (state, action: PayloadAction<number>) => {
            return state.filter((el) => el.id !== action.payload);
        },
        updateStatus: (
            state,
            action: PayloadAction<{ id: number; status: string }>
        ) => {
            return state.map((el) => {
                if (el.id === action.payload.id) {
                    return { ...el, status: action.payload.status };
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
