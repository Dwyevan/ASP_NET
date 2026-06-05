import axiosClient from '../api/axiosClient';

const wineService = {
    // Products
    getAllWines: () => {
        return axiosClient.get('/Products');
    },
    getWineById: (id) => {
        return axiosClient.get(`/Products/${id}`);
    },
    getWinesByCategory: (categoryId) => {
        return axiosClient.get(`/Products/categoryproduct/${categoryId}`);
    },

    // Categories
    getWineCategories: () => {
        return axiosClient.get('/CategoriesProduct');
    },

    // Orders / Checkout
    checkoutOrder: (orderData) => {
        // Mock POST to orders endpoint
        return axiosClient.post('/Orders', orderData);
    }
};

export default wineService;
