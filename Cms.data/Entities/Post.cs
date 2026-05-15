using System;

namespace Cms.data.Entities
{
    public class Post
    {
        public int Id { get; set; }
        public string Title { get; set; } // Tiêu đề bài viết
        public string Content { get; set; } // Nội dung chi tiết bài viết
        public string ImageUrl { get; set; } // Đường dẫn ảnh đại diện
        public DateTime CreatedDate { get; set; } = DateTime.Now; // Ngày tạo (mặc định là hiện tại)

        // Khóa ngoại liên kết tới bảng Category
        public int CategoryId { get; set; }
        public virtual Category Category { get; set; }
    }
}