export const API_BASE_URL = "https://strong-complete-sculpin.ngrok-free.app/api";

export const API_ENDPOINTS = {
    login: `${API_BASE_URL}/auth/login`,
    refresh_token: `${API_BASE_URL}/auth/refresh-token` ,
    current_user: `${API_BASE_URL}/users/me`
}

export const API_CONFIG = {
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    timeout: 10000, 
}
