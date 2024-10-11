import { API_BASE_URL, API_CONFIG } from "@/configs/apiConfig";
import axios from "axios";
import { getAuthToken, isTokenExpired } from "./authService";
import { logout } from "@/store/slices/authSlice";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  ...API_CONFIG,
});

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

export const fetchData = async (endpoint: string) => {
  try {
    const response = await apiClient.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("API GET Error:", error);
    throw error;
  }
};

export const postData = async (endpoint: string, data: any) => {
  try {
    const response = await apiClient.post(endpoint, data);
    return response.data;
  } catch (error) {
    console.error("API POST Error:", error);
    throw error;
  }
};

export const updateData = async (endpoint: string, data: any) => {
  try {
    const response = await apiClient.put(endpoint, data);
    return response.data;
  } catch (error) {
    console.error("API PUT Error:", error);
    throw error;
  }
};

export const deleteData = async (endpoint: string) => {
  try {
    const response = await apiClient.delete(endpoint);
    return response.data;
  } catch (error) {
    console.error("API DELETE Error:", error);
    throw error;
  }
};

export default apiClient;
