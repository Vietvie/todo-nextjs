import userApi from '@/services/user';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { cookies } from 'next/headers';

export type UserInfo = {
    id: number | string;
    name: string;
    email: string;
};

type AuthState = {
    isLogined: boolean;
    userInfo?: UserInfo;
};

const initialState: AuthState = {
    isLogined: false,
    userInfo: undefined,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login(state, action) {
            state.isLogined = true;
        },
        logout(state, action) {
            state.isLogined = false;
        },
        setUserInfo(state, action: PayloadAction<UserInfo>) {
            state.userInfo = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(
            getUserInfoByToken.fulfilled,
            (state, action: PayloadAction<UserInfo>) => {
                state.userInfo = action.payload;
                state.isLogined = true;
            }
        );
        builder.addCase(getUserInfoByToken.rejected, () => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        });
    },
});

const authActions = authSlice.actions;
const authReducer = authSlice.reducer;

const getUserInfoByToken = createAsyncThunk(
    'auth/getUserInfoByToken',
    async () => {
        const { data } = await userApi.getMe();
        const userInfo: UserInfo = data.data.user;
        return userInfo;
    }
);

export { authActions, getUserInfoByToken };
export default authReducer;
