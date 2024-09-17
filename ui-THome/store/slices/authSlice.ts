import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { setAuthToken, removeAuthToken, getAuthToken, getTokenExpiry, setTokenExpiry, isTokenExpired } from '@/services/authService';
import apiClient from '@/services/apiService';
import { API_ENDPOINTS } from '@/configs/apiConfig';

// Khai báo giao diện cho trạng thái auth
interface AuthState {
    token: string | null;
    user: any | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    token: null,
    user: null,
    isAuthenticated: false,
};

// Thunk để thực hiện login
export const loginAsync = createAsyncThunk(
    'auth/loginAsync',
    async ({ email, password }: { email: string; password: string }, { dispatch }) => {
        const response = await apiClient.post(API_ENDPOINTS.LOGIN, { email, password });
        const data = response.data;
        const accessToken = data.access_token;
        const refreshToken = data.refresh_token;
        const expireIn = data.expireIn;

        if (accessToken && refreshToken && expireIn) {
            await setAuthToken(accessToken, refreshToken);
            await setTokenExpiry(expireIn);
            const userResponse = await apiClient.get(API_ENDPOINTS.CURRENT_USER);
            const user = userResponse.data;

            // Dispatch login action để cập nhật Redux state
            dispatch(login({ token: accessToken, user }));
            return { accessToken, user };
        } else {
            throw new Error('Login failed: Missing tokens');
        }
    }
);

// Thunk để thực hiện logout
export const logoutAsync = createAsyncThunk('auth/logoutAsync', async (_, { dispatch }) => {
    await removeAuthToken();
    dispatch(logout());
});

// Thunk để kiểm tra token từ AsyncStorage khi app khởi động (ví dụ ở SplashScreen)
export const checkTokenAsync = createAsyncThunk('auth/checkTokenAsync', async (_, { dispatch }) => {
    const token = await getAuthToken();
    const expired = await isTokenExpired();

    if (token && !expired) {
        const userResponse = await apiClient.get(API_ENDPOINTS.CURRENT_USER);
        const user = userResponse.data;
        dispatch(login({ token, user }));
    } else {
        dispatch(logout());
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login(state, action: PayloadAction<{ token: string; user: any }>) {
            state.token = action.payload.token;
            state.user = action.payload.user;
            state.isAuthenticated = true;
        },
        logout(state) {
            state.token = null;
            state.user = null;
            state.isAuthenticated = false;
        },
        updateUser(state, action: PayloadAction<{ user: any }>) {
            state.user = action.payload.user;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginAsync.fulfilled, (state, action) => {
                state.token = action.payload.accessToken;
                state.user = action.payload.user;
                state.isAuthenticated = true;
            })
            .addCase(logoutAsync.fulfilled, (state) => {
                state.token = null;
                state.user = null;
                state.isAuthenticated = false;
            })
            .addCase(checkTokenAsync.fulfilled, (state, action) => {
                if (!action.payload) {
                    state.isAuthenticated = false;
                    state.token = null;
                    state.user = null;
                }
            });
    },
});

export const { login, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
