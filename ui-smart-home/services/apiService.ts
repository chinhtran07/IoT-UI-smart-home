import { API_BASE_URL, API_CONFIG } from "@/configs/apiConfig";
import axios from "axios";
import { getAuthToken, removeAuthToken } from "@/services/authService";
import store from "@/store/store";
import { logout } from "@/store/slices/authSlice";
import { navigateToLogin } from "./navigateService";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  ...API_CONFIG,
});

// Add a request interceptor
apiClient.interceptors.request.use(
  async (config) => {
    const token = await getAuthToken();

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response && [401, 500].includes(error.response.status)) {
      await removeAuthToken();

      store.dispatch(logout());

      navigateToLogin();

      console.error("Token expired. Please log in again.");
      
      return Promise.reject("Session expired. Please log in again.");
    }

    return Promise.reject(error);
  }
);

export default apiClient;
