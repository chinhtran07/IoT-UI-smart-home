import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    token: string | null;
  }

interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: string;
    avatarURL: string;
}

const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    token: null,
  };

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<{ user: User; token: string }>) => {
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.token = action.payload.token;
        },

        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
        },
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;