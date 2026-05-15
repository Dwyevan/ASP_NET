using System.Collections.Generic;

namespace Cms.data.Entities
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public int StockQuantity { get; set; }
        public string ImageUrl { get; set; }

        // Khóa ngoại tới CategoryProduct
        public int CategoryProductId { get; set; }
        public virtual CategoryProduct CategoryProduct { get; set; }

        // Quan hệ: Một sản phẩm có thể nằm trong nhiều chi tiết đơn hàng
        public virtual ICollection<OrderDetail> OrderDetails { get; set; }
    }
}