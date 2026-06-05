import axiosClient from '../api/axiosClient';

const blogService = {
    // 1. Hàm lấy danh sách toàn bộ bài viết (Post) từ Backend
    getAllPosts: () => {
        const url = '/Posts'; // Phải khớp chính xác với cấu hình Route trong PostController ở Backend
        return axiosClient.get(url);
    },

    // 2. Hàm lấy chi tiết 1 bài viết theo ID (Phục vụ trang xem chi tiết sau này)
    getPostById: (id) => {
        const url = `/Posts/${id}`;
        return axiosClient.get(url);
    },

    // 3. Hàm lấy danh sách Chuyên mục tin tức (Category)
    getBlogCategories: () => {
        const url = '/Categories'; // Cần khớp chính xác với [Route("api/Categories")] trong CategoriesController ở Backend
        return axiosClient.get(url);
    }
};

export default blogService;
