using CMS.Data;
using Microsoft.AspNetCore.Mvc;
using System.Linq; // Bắt buộc thêm để dùng được các hàm truy vấn Where, ToList

using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    [Authorize(Roles = "Admin")]
    public class CustomerController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CustomerController(ApplicationDbContext context)
        {
            _context = context;
        }

        //--------------------------------------------------
        // HIỂN THỊ DANH SÁCH & TÌM KIẾM KHÁCH HÀNG (INDEX)
        //--------------------------------------------------
        public IActionResult Index(string keyword)
        {
            // Lấy toàn bộ danh sách khách hàng từ Database
            var customers = _context.Customers.AsQueryable();

            // Xử lý tìm kiếm: Nếu người dùng có nhập từ khóa, tiến hành lọc theo Tên hoặc Số điện thoại
            if (!string.IsNullOrEmpty(keyword))
            {
                customers = customers.Where(c => c.FullName.Contains(keyword) || c.Phone.Contains(keyword));
            }

            // Trả về View kèm theo danh sách đã lọc (hoặc toàn bộ nếu không tìm kiếm)
            return View(customers.ToList());
        }

        //--------------------------------------------------
        // KHÓA / MỞ KHÓA KHÁCH HÀNG (TOGGLE LOCK)
        //--------------------------------------------------
        [HttpPost]
        public IActionResult ToggleLock(int id)
        {
            var customer = _context.Customers.Find(id);
            if (customer != null)
            {
                if (customer.Password.StartsWith("[LOCKED]"))
                {
                    // Mở khóa: Cắt bỏ chữ [LOCKED]
                    customer.Password = customer.Password.Substring(8);
                }
                else
                {
                    // Khóa: Thêm chữ [LOCKED] lên đầu
                    customer.Password = "[LOCKED]" + customer.Password;
                }
                _context.SaveChanges();
            }

            return RedirectToAction("Index");
        }

        //--------------------------------------------------
        // XEM CHI TIẾT KHÁCH HÀNG (KÈM LỊCH SỬ ĐƠN HÀNG)
        //--------------------------------------------------
        public IActionResult Details(int id)
        {
            // Tải Customer kèm toàn bộ danh sách Orders (và OrderDetails bên trong)
            var customer = _context.Customers
                .Include(c => c.Orders)
                    .ThenInclude(o => o.OrderDetails)
                .FirstOrDefault(c => c.Id == id);

            if (customer == null) return NotFound();

            return View(customer);
        }
    }
}