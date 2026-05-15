namespace Cms.data.Entities
{
    public class OrderDetail
    {
        public int Id { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }

        // Khóa ngoại tới Order
        public int OrderId { get; set; }
        public virtual Order Order { get; set; }

        // Khóa ngoại tới Product
        public int ProductId { get; set; }
        public virtual Product Product { get; set; }
    }
}