import axiosClient from '../api/axiosClient';

const orderService = {
    createOrder: (orderData) => {
        return axiosClient.post('/Orders', orderData);
    },
    createMoMoPayment: (paymentData) => {
        return axiosClient.post('/Payment/MoMo', paymentData);
    }
};

export default orderService;
