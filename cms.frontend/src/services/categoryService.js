import axiosClient from '../api/axiosClient';

const categoryService = {
    getAllCategories: () => {
        return axiosClient.get('/CategoriesProducts');
    }
};

export default categoryService;
