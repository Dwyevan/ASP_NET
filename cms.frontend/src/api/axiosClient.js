import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'https://localhost:7250/api',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Thêm Request Interceptor để đính kèm Token
axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosClient.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            console.error('Hết hạn phiên đăng nhập hoặc không có quyền truy cập');
            // Xóa token (nhưng GIỮ user để Checkout hiển thị cảnh báo thay vì mất giỏ hàng)
            localStorage.removeItem('token');
            // Không redirect nếu đang ở trang checkout hoặc payment-result (để giữ giỏ hàng)
            const currentPath = window.location.pathname;
            const noRedirectPages = ['/login', '/checkout', '/payment-result', '/register'];
            if (!noRedirectPages.includes(currentPath)) {
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        } else {
            console.error('Lỗi kết nối API:', error.message);
        }
        return Promise.reject(error);
    }
);

export default axiosClient;
