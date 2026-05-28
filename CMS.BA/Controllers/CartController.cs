using CMS.BA.Helpers; // Gọi công cụ ép kiểu Session
using CMS.BA.Models;   // Gọi đối tượng CartItem
using CMS.Data;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;

namespace CMS.BA.Controllers
{
    public class CartController : Controller
    {
        private readonly ApplicationDbContext _context;
        private const string CART_KEY = "Hethong_GioHang"; // Chìa khóa để lưu Session

        public CartController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Hàm hỗ trợ lấy Giỏ hàng từ Session ra
        private List<CartItem> GetCartItems()
        {
            return HttpContext.Session.Get<List<CartItem>>(CART_KEY) ?? new List<CartItem>();
        }

        //--------------------------------------------------
        // 1. HIỂN THỊ TRANG GIỎ HÀNG
        //--------------------------------------------------
        public IActionResult Index()
        {
            var cart = GetCartItems();
            return View(cart);
        }

        //--------------------------------------------------
        // 2. THÊM SẢN PHẨM VÀO GIỎ
        //--------------------------------------------------
        public IActionResult AddToCart(int id)
        {
            var product = _context.Products.Find(id);
            if (product == null) return NotFound();

            var cart = GetCartItems();
            var item = cart.FirstOrDefault(c => c.ProductId == id);

            if (item != null)
            {
                item.Quantity++; // Nếu đã có trong giỏ thì tăng số lượng lên 1
            }
            else
            {
                // Nếu chưa có thì thêm món mới vào giỏ
                cart.Add(new CartItem
                {
                    ProductId = product.Id,
                    ProductName = product.Name,
                    ImageUrl = product.ImageUrl,
                    Price = product.Price,
                    Quantity = 1
                });
            }

            // Lưu ngược lại giỏ hàng vào Session
            HttpContext.Session.Set(CART_KEY, cart);

            // Thêm xong thì quay lại trang Cửa hàng chính
            return RedirectToAction("Index", "Shop");
        }

        //--------------------------------------------------
        // 3. XÓA 1 MÓN KHỎI GIỎ HÀNG
        //--------------------------------------------------
        public IActionResult RemoveFromCart(int id)
        {
            var cart = GetCartItems();
            var item = cart.FirstOrDefault(c => c.ProductId == id);

            if (item != null)
            {
                cart.Remove(item);
                HttpContext.Session.Set(CART_KEY, cart);
            }
            return RedirectToAction("Index");
        }
    }
}