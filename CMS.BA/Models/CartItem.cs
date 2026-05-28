namespace CMS.BA.Models
{
    public class CartItem
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public string ImageUrl { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }

        // Tự động tính tổng tiền của món hàng này (Giá x Số lượng)
        public decimal Total => Price * Quantity;
    }
}