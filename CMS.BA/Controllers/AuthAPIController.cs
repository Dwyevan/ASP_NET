using Cms.data.Entities;
using CMS.Data;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace CMS.BA.Controllers
{
    public class RegisterRequest
    {
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
    }

    public class LoginRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class UpdateProfileRequest
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public string Password { get; set; } // Tùy chọn
    }

    [Route("api/Auth")]
    [ApiController]
    public class AuthAPIController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AuthAPIController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("CustomerRegister")]
        public IActionResult CustomerRegister([FromBody] RegisterRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Check if email exists
            if (_context.Customers.Any(c => c.Email == request.Email))
            {
                return BadRequest(new { message = "Email này đã được sử dụng" });
            }

            var customer = new Customer
            {
                FullName = request.FullName,
                Email = request.Email,
                Password = request.Password, // In a real app, hash this password!
                Phone = request.Phone,
                Address = request.Address
            };

            _context.Customers.Add(customer);
            _context.SaveChanges();

            return Ok(new { message = "Đăng ký thành công", customerId = customer.Id });
        }

        [HttpPost("CustomerLogin")]
        public IActionResult CustomerLogin([FromBody] LoginRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // 1. Kiểm tra xem có phải tài khoản Admin (bảng Users) không
            var adminUser = _context.Users.FirstOrDefault(u => u.Username == request.Email && u.PasswordHash == request.Password);
            if (adminUser != null)
            {
                return Ok(new
                {
                    message = "Đăng nhập quản trị viên",
                    isAdmin = true
                });
            }

            // 2. Nếu không phải Admin, kiểm tra tài khoản Khách hàng (bảng Customers)
            var customer = _context.Customers
                .FirstOrDefault(c => c.Email == request.Email);

            if (customer == null)
            {
                return Unauthorized(new { message = "Tài khoản hoặc mật khẩu không chính xác" });
            }

            if (customer.Password.StartsWith("[LOCKED]"))
            {
                return Unauthorized(new { message = "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ Hotline (1900 8888) để hỗ trợ mở khóa." });
            }

            if (customer.Password != request.Password)
            {
                return Unauthorized(new { message = "Tài khoản hoặc mật khẩu không chính xác" });
            }

            return Ok(new 
            { 
                message = "Đăng nhập thành công", 
                isAdmin = false,
                customer = new 
                {
                    customer.Id,
                    customer.FullName,
                    customer.Email,
                    customer.Phone,
                    customer.Address
                }
            });
        }

        [HttpPut("UpdateProfile")]
        public IActionResult UpdateProfile([FromBody] UpdateProfileRequest request)
        {
            var customer = _context.Customers.Find(request.Id);
            if (customer == null)
            {
                return NotFound(new { message = "Không tìm thấy tài khoản" });
            }

            // Kiểm tra trùng email nếu đổi email mới
            if (customer.Email != request.Email && _context.Customers.Any(c => c.Email == request.Email))
            {
                return BadRequest(new { message = "Email này đã được sử dụng bởi người khác" });
            }

            customer.FullName = request.FullName;
            customer.Email = request.Email;
            customer.Phone = request.Phone;
            customer.Address = request.Address;

            if (!string.IsNullOrEmpty(request.Password))
            {
                customer.Password = request.Password;
            }

            _context.SaveChanges();

            return Ok(new 
            { 
                message = "Cập nhật thành công",
                customer = new 
                {
                    customer.Id,
                    customer.FullName,
                    customer.Email,
                    customer.Phone,
                    customer.Address
                }
            });
        }
    }
}
