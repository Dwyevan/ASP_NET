import axiosClient from '../api/axiosClient';

const productService = {
    getAllProducts: () => {
        return axiosClient.get('/Products?page=1&pageSize=1000');
    },
    getProductById: (id) => {
        return axiosClient.get(`/Products/${id}`);
    },
    getProductsByCategory: (categoryId) => {
        return axiosClient.get(`/Products/category/${categoryId}`);
    }
};

export default productService;
