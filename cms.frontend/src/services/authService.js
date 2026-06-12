import axiosClient from '../api/axiosClient';

const authService = {
    login: (email, password) => {
        const url = '/Auth/CustomerLogin';
        return axiosClient.post(url, { email, password });
    },

    register: (data) => {
        const url = '/Auth/CustomerRegister';
        return axiosClient.post(url, data);
    }
};

export default authService;
