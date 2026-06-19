using System.Collections.Generic;

namespace Cms.data.Entities
{
    public class CategoryProduct
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string ImageUrl { get; set; }

        // Quan hệ: Một danh mục có nhiều sản phẩm
        public virtual ICollection<Product> Products { get; set; }
    }
}