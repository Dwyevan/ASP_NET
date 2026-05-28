using CMS.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http; // BẮT BUỘC: Thư viện hỗ trợ quản lý bộ nhớ Session dữ liệu
using System.Linq;

namespace CMS.BA.Controllers
{
    public class AccountController : Controller
    {
        private readonly ApplicationDbContext _context;

        // Nhận kết nối cơ sở dữ liệu qua cơ chế Dependency Injection thông qua Constructor
        public AccountController(ApplicationDbContext context)
        {
            _context = context;
        }

        //--------------------------------------------------
        // GIAO DIỆN ĐĂNG NHẬP (GET: /Account/Login)
        //--------------------------------------------------
        [HttpGet]
        public IActionResult Login()
        {
            // Kiểm tra thông minh: Nếu người dùng đã đăng nhập thành công từ trước, tự động đá thẳng vào Admin Panel
            if (!string.IsNullOrEmpty(HttpContext.Session.GetString("UserEmail")))
            {
                return RedirectToAction("Index", "Product");
            }

            return View();
        }

        //--------------------------------------------------
        // XỬ LÝ LOGIC KIỂM TRA ĐĂNG NHẬP (POST: /Account/Login)
        //--------------------------------------------------
        [HttpPost]
        public IActionResult Login(string email, string password)
        {
            // ĐỒNG BỘ: Truy vấn dựa trên cột 'Username' và 'PasswordHash' khớp hoàn toàn với file Entity User.cs của bạn
            // Biến nhận 'email' từ giao diện form truyền lên giờ sẽ đóng vai trò là Tên đăng nhập (Username)
            var user = _context.Users
                .FirstOrDefault(u => u.Username == email && u.PasswordHash == password);

            if (user != null)
            {
                // KHỞI TẠO SESSION: Lưu thông tin định danh vào bộ nhớ trình duyệt để quản lý phiên làm việc
                HttpContext.Session.SetString("UserEmail", user.Username); // Giữ key "UserEmail" để không phải sửa code chặn ở LayoutAdmin
                HttpContext.Session.SetString("UserName", user.FullName);
                HttpContext.Session.SetString("UserRole", user.Role ?? "Admin"); // Nếu cột quyền bị null thì mặc định gán là Admin

                // Đăng nhập thành công -> Điều hướng đưa quản trị viên vào trang Quản lý sản phẩm lọt lòng LayoutAdmin
                return RedirectToAction("Index", "Product");
            }

            // Gửi thông báo lỗi bằng chữ đỏ ra ngoài giao diện nếu gõ sai tài khoản hoặc mật khẩu
            ViewBag.ErrorMessage = "Tên đăng nhập hoặc Mật khẩu không chính xác. Vui lòng thử lại!";
            return View();
        }

        //--------------------------------------------------
        // CHỨC NĂNG ĐĂNG XUẤT HỆ THỐNG (GET: /Account/Logout)
        //--------------------------------------------------
        public IActionResult Logout()
        {
            // Xóa sạch sành sanh mọi dữ liệu trạng thái đã lưu trữ trong Session của trình duyệt
            HttpContext.Session.Clear();

            // Đẩy tài khoản quay về trang đăng nhập ban đầu
            return RedirectToAction("Login");
        }
    }
}