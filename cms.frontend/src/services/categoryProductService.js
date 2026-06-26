import axiosClient from '../api/axiosClient';

const categoryProductService = {
    getAllCategoryProducts: () => {
        const url = '/CategoriesProducts?page=1&pageSize=1000';
        return axiosClient.get(url);
    }
};

export default categoryProductService;
