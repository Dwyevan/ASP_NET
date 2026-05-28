using System.Diagnostics;
using CMS.BA.Models;
using Microsoft.AspNetCore.Mvc;
using CMS.Data; // B?T BU?C: Thêm ?? g?i ???c ApplicationDbContext
using System.Linq; // B?T BU?C: Thêm ?? dùng hàm Count() và Sum()

namespace CMS.BA.Controllers
{
    public class HomeController : Controller
    {
        // Gi? nguyên Logger c?a b?n và khai báo thêm Context g?i Database
        private readonly ILogger<HomeController> _logger;
        private readonly ApplicationDbContext _context;

        // Tiêm c? 2 d?ch v? vào Constructor
        public HomeController(ILogger<HomeController> logger, ApplicationDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        //--------------------------------------------------
        // HI?N TH? TRANG CH? & TÍNH TOÁN S? LI?U DASHBOARD
        //--------------------------------------------------
        public IActionResult Index()
        {
            // 1. ??m t?ng s? l??ng S?n ph?m
            ViewBag.TotalProducts = _context.Products.Count();

            // 2. ??m t?ng s? l??ng ??n hàng
            ViewBag.TotalOrders = _context.Orders.Count();

            // 3. ??m t?ng s? l??ng Khách hàng
            ViewBag.TotalCustomers = _context.Customers.Count();

            // 4. Tính t?ng doanh thu (C?ng d?n c?t TotalAmount trong b?ng Orders)
            ViewBag.TotalRevenue = _context.Orders.Any()
                ? _context.Orders.Sum(o => o.TotalAmount)
                : 0;

            return View();
        }

        //--------------------------------------------------
        // CÁC HÀM M?C ??NH C?A H? TH?NG (GI? NGUYÊN)
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