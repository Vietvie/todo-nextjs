import { Status } from '@/constants';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: { task: string; status: Status | '' } = {
    task: '',
    status: '',
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
    },
});

const filterAction = filterSlice.actions;
const filterReducer = filterSlice.reducer;

export default filterReducer;
export { filterAction };
