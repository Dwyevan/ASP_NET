import axiosClient from '../api/axiosClient';

const productService = {
    getAllProducts: () => {
        return axiosClient.get('/Products');
    },
    getProductById: (id) => {
        return axiosClient.get(`/Products/${id}`);
    },
    getProductsByCategory: (categoryId) => {
        return axiosClient.get(`/Products/category/${categoryId}`);
    }
};

export default productService;
