import { configureStore } from '@reduxjs/toolkit';
import todoReducer from './todoSlice';
import { TypedUseSelectorHook, useSelector } from 'react-redux';
import filterReducer from './filterSlice';
import authReducer from './authSlice';

const store = configureStore({
    reducer: {
        todo: todoReducer,
        filter: filterReducer,
        auth: authReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export default store;
