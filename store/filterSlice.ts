import { SortType, Status } from '@/constants';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: {
    task: string;
    status: Status | '';
    createTime: 'asc' | 'desc' | '';
    deadlineTime: 'asc' | 'desc' | '';
} = {
    task: '',
    status: '',
    createTime: '',
    deadlineTime: '',
};

const filterSlice = createSlice({
    name: 'filter',
    initialState,
    reducers: {
        changeTask(state, action: PayloadAction<string>) {
            state.task = action.payload;
        },
        filterStatus(state, action: PayloadAction<Status | ''>) {
            state.status = action.payload;
        },
        sortByCreateTime(state, action: PayloadAction<'asc' | 'desc' | ''>) {
            state.createTime = action.payload;
        },
        sortByDeadlineTime(state, action: PayloadAction<'asc' | 'desc' | ''>) {
            state.deadlineTime = action.payload;
        },
    },
});

const filterAction = filterSlice.actions;
const filterReducer = filterSlice.reducer;

export default filterReducer;
export { filterAction };
