import AsyncStorage from '@react-native-async-storage/async-storage';

export const setAuthToken = async (accessToken: string, refreshToken: string) => {
    await AsyncStorage.setItem('authToken', accessToken);
    await AsyncStorage.setItem('refreshToken', refreshToken);
};

export const getAuthToken = async (): Promise<string | null> => {
    return await AsyncStorage.getItem('authToken');
};

export const removeAuthToken = async () => {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('refreshToken');
};

export const setTokenExpiry = async (expireIn: string) => {
    const currentTime = Date.now();
    const expiryTime = currentTime + parseExpireIn(expireIn);
    await AsyncStorage.setItem('tokenExpiry', expiryTime.toString());
};

export const getTokenExpiry = async (): Promise<number | null> => {
    const expiry = await AsyncStorage.getItem('tokenExpiry');
    return expiry ? parseInt(expiry, 10) : null;
};

export const isTokenExpired = async (): Promise<boolean> => {
    const expiryTime = await getTokenExpiry();
    if (!expiryTime) return true;
    return Date.now() > expiryTime;
};

const parseExpireIn = (expireIn: string): number => {
    const unit = expireIn.slice(-1);
    const value = parseInt(expireIn.slice(0, -1), 10);
    if (unit === 'h') return value * 3600 * 1000;
    if (unit === 'm') return value * 60 * 1000;
    return value * 1000; 
};

export const getRefreshToken = async (): Promise<string | null> => {
    return await AsyncStorage.getItem('refreshToken');
};
