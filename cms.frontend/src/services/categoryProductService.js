import axiosClient from '../api/axiosClient';

const categoryProductService = {
    getAllCategoryProducts: () => {
        const url = '/CategoriesProducts';
        return axiosClient.get(url);
    }
};

export default categoryProductService;
