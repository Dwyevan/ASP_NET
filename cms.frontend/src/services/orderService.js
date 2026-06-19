import axiosClient from '../api/axiosClient';

const orderService = {
    createOrder: (orderData) => {
        return axiosClient.post('/Orders', orderData);
    },
    createMoMoPayment: (paymentData) => {
        return axiosClient.post('/Payment/MoMo', paymentData);
    },
    mockMoMoReturn: (returnData) => {
        return axiosClient.post('/Payment/MoMoReturn', returnData);
    }
};

export default orderService;
