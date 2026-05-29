using System.Diagnostics;
using CMS.BA.Models;
using Microsoft.AspNetCore.Mvc;
using CMS.Data; // BẮT BUỘC: Thêm để gọi được ApplicationDbContext
using System.Linq; // BẮT BUỘC: Thêm để dùng hàm Count() và Sum()

namespace CMS.BA.Controllers
{
    [Microsoft.AspNetCore.Authorization.Authorize]
    public class HomeController : Controller
    {
        // Giữ nguyên Logger của bạn và khai báo thêm Context gọi Database
        private readonly ILogger<HomeController> _logger;
        private readonly ApplicationDbContext _context;

        // Tiêm cả 2 dịch vụ vào Constructor
        public HomeController(ILogger<HomeController> logger, ApplicationDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        //--------------------------------------------------
        // HIỂN THỊ TRANG CHỦ & TÍNH TOÁN SỐ LIỆU DASHBOARD
        //--------------------------------------------------
        public IActionResult Index()
        {
            // 1. Đếm tổng số lượng Sản phẩm
            ViewBag.TotalProducts = _context.Products.Count();

            // 2. Đếm tổng số lượng Đơn hàng
            ViewBag.TotalOrders = _context.Orders.Count();

            // 3. Đếm tổng số lượng Khách hàng
            ViewBag.TotalCustomers = _context.Customers.Count();

            // 4. Tính tổng doanh thu (Cộng dồn cột TotalAmount trong bảng Orders)
            ViewBag.TotalRevenue = _context.Orders.Any()
                ? _context.Orders.Sum(o => o.TotalAmount)
                : 0;

            return View();
        }

        //--------------------------------------------------
        // CÁC HÀM MẶC ĐỊNH CỦA HỆ THỐNG (GIỮ NGUYÊN)
        //--------------------------------------------------
        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
