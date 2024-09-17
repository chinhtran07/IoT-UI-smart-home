export const API_BASE_URL = "https://ea3a-171-243-48-85.ngrok-free.app/api";

export const API_ENDPOINTS = {
    LOGIN: `${API_BASE_URL}/auth/login`,
    CURRENT_USER: `${API_BASE_URL}/users/me`
}

export const API_CONFIG = {
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    timeout: 10000, 
}
