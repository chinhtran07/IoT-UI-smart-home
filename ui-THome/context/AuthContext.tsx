import React, { createContext, ReactNode, useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { loginAsync, logoutAsync, checkTokenAsync } from '../store/slices/authSlice';
import { setAuthToken } from '@/services/authService';

interface AuthContextType {
    token: string | null;
    user: any | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { token, user, isAuthenticated } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        // Kiểm tra token khi ứng dụng khởi động
        dispatch(checkTokenAsync());
    }, [dispatch]);

    // Hàm đăng nhập
    const handleLogin = async (email: string, password: string) => {
        try {
             await dispatch(loginAsync({ email, password })).unwrap();
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    // Hàm đăng xuất
    const handleLogout = async () => {
        try {
            await dispatch(logoutAsync()).unwrap();
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ token, user, isAuthenticated, login: handleLogin, logout: handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
