import { configureStore } from '@reduxjs/toolkit';
import todoReducer from './todoSlice';
import { TypedUseSelectorHook, useSelector } from 'react-redux';

const store = configureStore({
    reducer: {
        todo: todoReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export default store;
