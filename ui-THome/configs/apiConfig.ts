export const API_BASE_URL = "http://localhost:3000/api";

export const API_ENDPOINTS = {
    LOGIN: `${API_BASE_URL}/auth/login`,
    CURRENT_USER: `${API_BASE_URL}/users/me`
}

export const API_CONFIG = {
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    timeout: 5000, 
}

