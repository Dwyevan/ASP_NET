using CMS.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace CMS.BA.Controllers
{
    public class ShopController : Controller
    {
        private readonly ApplicationDbContext _context;

        public ShopController(ApplicationDbContext context)
        {
            _context = context;
        }

        //--------------------------------------------------
        // TRANG CHỦ CỬA HÀNG (Hiển thị tất cả đồ uống)
        //--------------------------------------------------
        public IActionResult Index()
        {
            // Lấy danh sách sản phẩm kèm theo tên danh mục
            var products = _context.Products
                .Include(p => p.CategoryProduct)
                .ToList();

            return View(products);
        }
    }
}