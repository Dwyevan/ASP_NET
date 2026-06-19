import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Khôi phục user từ token trong localStorage khi reload trang
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // Kiểm tra token hết hạn
                if (decoded.exp * 1000 < Date.now()) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setUser(null);
                } else {
                    const storedUser = localStorage.getItem('user');
                    if (storedUser) {
                        setUser(JSON.parse(storedUser));
                    }
                }
            } catch (error) {
                console.error("Invalid token:", error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await authService.login(email, password);
            
            // Nếu là Admin
            if (response.isAdmin) {
                return { success: true, message: response.message, isAdmin: true };
            }

            // Nếu là Khách hàng bình thường, lưu token
            if (response.token) {
                localStorage.setItem('token', response.token);
            }
            
            const userData = response.customer;
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            return { success: true, message: response.message, isAdmin: false };
        } catch (error) {
            console.error("Login error:", error);
            const errorMsg = error.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
            return { success: false, message: errorMsg };
        }
    };

    const register = async (data) => {
        try {
            const response = await authService.register(data);
            return { success: true, message: response.message };
        } catch (error) {
            console.error("Register error:", error);
            const errorMsg = error.response?.data?.message || 'Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.';
            return { success: false, message: errorMsg };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    const value = {
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
