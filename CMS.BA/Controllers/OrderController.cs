using CMS.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; // BẮT BUỘC: Thêm thư viện này để dùng được lệnh .Include()
using System.Linq;

namespace CMS.Backend.Controllers
{
    public class OrderController : Controller
    {
        private readonly ApplicationDbContext _context;

        public OrderController(ApplicationDbContext context)
        {
            _context = context;
        }

        //--------------------------------------------------
        // BÀI TẬP 6: HIỂN THỊ DANH SÁCH ĐƠN HÀNG (INDEX)
        //--------------------------------------------------
        public IActionResult Index()
        {
            // SỬA TẠI ĐÂY: Thêm .Include(o => o.Customer) để lấy kèm tên Khách hàng mua đơn đó
            var orders = _context.Orders
                .Include(o => o.Customer)
                .ToList();

            return View(orders);
        }

        //--------------------------------------------------
        // BÀI TẬP 7: XEM CHI TIẾT CỦA MỘT ĐƠN HÀNG CỤ THỂ (DETAILS)
        //--------------------------------------------------
        public IActionResult Details(int id)
        {
            // Lấy ra danh sách các sản phẩm nằm trong đơn hàng có mã ID tương ứng
            // .Include(d => d.Product) giúp kéo theo thông tin tên sản phẩm, ảnh, giá bán
            var orderDetails = _context.OrderDetails
                .Include(d => d.Product)
                .Where(d => d.OrderId == id)
                .ToList();

            // Đề phòng trường hợp bấm nhầm ID đơn hàng không tồn tại
            if (orderDetails == null)
            {
                return NotFound();
            }

            // Gửi mã đơn hàng qua ViewBag để hiển thị làm tiêu đề ngoài giao diện View
            ViewBag.OrderId = id;

            return View(orderDetails);
        }
    }
}