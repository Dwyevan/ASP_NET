using System.Collections.Generic;

namespace Cms.data.Entities
{
    public class Customer
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public string Password { get; set; }

        // Quan hệ: Một khách hàng có thể có nhiều đơn hàng
        public virtual ICollection<Order> Orders { get; set; }
    }
}