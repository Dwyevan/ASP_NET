using CMS.Data;
using Microsoft.AspNetCore.Mvc;
using System.Linq; // Bắt buộc thêm để dùng được các hàm truy vấn Where, ToList

using Microsoft.AspNetCore.Authorization;

namespace CMS.Backend.Controllers
{
    [Authorize]
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
        // XÓA KHÁCH HÀNG (DELETE)
        //--------------------------------------------------
        public IActionResult Delete(int id)
        {
            // Tìm khách hàng theo ID truyền xuống
            var customer = _context.Customers.Find(id);

            if (customer != null)
            {
                _context.Customers.Remove(customer); // Đánh dấu xóa
                _context.SaveChanges();              // Lưu thay đổi xuống SQL Server
            }

            // Xóa xong tự động quay lại trang danh sách
            return RedirectToAction("Index");
        }
    }
}