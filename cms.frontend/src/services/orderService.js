import axiosClient from '../api/axiosClient';

const orderService = {
    createOrder: (orderData) => {
        return axiosClient.post('/Orders', orderData);
    }
};

export default orderService;
