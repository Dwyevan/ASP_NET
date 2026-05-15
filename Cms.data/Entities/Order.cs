using System;
using System.Collections.Generic;

namespace Cms.data.Entities
{
    public class Order
    {
        public int Id { get; set; }
        public DateTime OrderDate { get; set; } = DateTime.Now;
        public decimal TotalAmount { get; set; }
        public int Status { get; set; } // 0: Chờ duyệt, 1: Đang giao, 2: Đã giao...

        // Khóa ngoại tới Customer
        public int CustomerId { get; set; }
        public virtual Customer Customer { get; set; }

        // Quan hệ: Một đơn hàng có nhiều chi tiết đơn hàng
        public virtual ICollection<OrderDetail> OrderDetails { get; set; }
    }
}