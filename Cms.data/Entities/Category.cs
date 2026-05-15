using System;
using System.Collections.Generic;

namespace Cms.data.Entities
{
    // Đổi 'internal' thành 'public' để các lớp khác truy cập được
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; } // Tên danh mục (ví dụ: Tin thời sự)
        public string Description { get; set; } // Mô tả ngắn

        // Quan hệ: Một danh mục có thể chứa nhiều bài viết (Post)
        public virtual ICollection<Post> Posts { get; set; }
    }
}