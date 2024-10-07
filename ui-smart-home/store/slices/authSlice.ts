import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import {
  setAuthToken,
  removeAuthToken,
  getAuthToken,
  getTokenExpiry,
  setTokenExpiry,
  isTokenExpired,
} from "@/services/authService";
import apiClient from "@/services/apiService";
import { API_ENDPOINTS } from "@/configs/apiConfig";

// Define the AuthState interface
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

// Helper function to handle user fetching
const fetchUser = async () => {
  const userResponse = await apiClient.get(API_ENDPOINTS.users.current_user);
  return userResponse.data;
};

// Async thunk for login
export const loginAsync = createAsyncThunk(
  "auth/loginAsync",
  async ({ email, password }: { email: string; password: string }, { dispatch }) => {
    const { data } = await apiClient.post(API_ENDPOINTS.auth.login, { email, password });
    const { access_token: accessToken, refresh_token: refreshToken, expireIn } = data;

    if (accessToken && refreshToken && expireIn) {
      await setAuthToken(accessToken, refreshToken);
      await setTokenExpiry(expireIn);
      const user = await fetchUser();
      dispatch(login({ token: accessToken, user }));
      return { accessToken, user };
    }
    throw new Error("Login failed: Missing tokens");
  }
);

// Async thunk for logout
export const logoutAsync = createAsyncThunk("auth/logoutAsync", async (_, { dispatch }) => {
  await removeAuthToken();
  dispatch(logout());
});

// Async thunk for checking token on app startup
export const checkTokenAsync = createAsyncThunk("auth/checkTokenAsync", async (_, { dispatch }) => {
  const token = await getAuthToken();
  if (token && !(await isTokenExpired())) {
    const user = await fetchUser();
    dispatch(login({ token, user }));
  } else {
    dispatch(logout());
  }
});

// Create the auth slice
const authSlice = createSlice({
  name: "auth",
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
      });
  },
});

// Export actions and reducer
export const { login, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
