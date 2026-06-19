using Cms.data.Entities;
using CMS.Data;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.SignalR;
using CMS.BA.Hubs;

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
        private readonly IConfiguration _configuration;
        private readonly IHubContext<AdminHub> _adminHubContext;

        public AuthAPIController(ApplicationDbContext context, IConfiguration configuration, IHubContext<AdminHub> adminHubContext)
        {
            _context = context;
            _configuration = configuration;
            _adminHubContext = adminHubContext;
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
                // Băm mật khẩu thay vì lưu văn bản thuần
                Password = BCrypt.Net.BCrypt.HashPassword(request.Password), 
                Phone = request.Phone,
                Address = request.Address
            };

            _context.Customers.Add(customer);
            _context.SaveChanges();

            // Gửi sự kiện thời gian thực (Real-time) tới toàn bộ các trang Quản trị viên (Admin) đang mở
            _adminHubContext.Clients.All.SendAsync("ReceiveNewCustomer", new {
                id = customer.Id,
                fullName = customer.FullName,
                email = customer.Email,
                phone = customer.Phone ?? "Chưa cung cấp"
            });

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
                // TODO: Nên tạo JWT cho Admin nữa, nhưng tạm thời trả về để tương thích frontend hiện tại
                return Ok(new
                {
                    message = "Đăng nhập quản trị viên",
                    isAdmin = true
                });
            }

            // 2. Nếu không phải Admin, kiểm tra tài khoản Khách hàng (bảng Customers)
            var customer = _context.Customers.FirstOrDefault(c => c.Email == request.Email);

            if (customer == null)
            {
                return Unauthorized(new { message = "Tài khoản hoặc mật khẩu không chính xác" });
            }

            if (customer.Password.StartsWith("[LOCKED]"))
            {
                return Unauthorized(new { message = "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ Hotline (1900 8888) để hỗ trợ mở khóa." });
            }

            bool isPasswordValid = false;

            // Tự động Migrate mật khẩu cũ chưa mã hóa
            if (!customer.Password.StartsWith("$2a$") && !customer.Password.StartsWith("$2b$") && !customer.Password.StartsWith("$2y$"))
            {
                // Mật khẩu cũ lưu dạng chữ thường
                if (customer.Password == request.Password)
                {
                    isPasswordValid = true;
                    // Hash lại mật khẩu để lần sau an toàn hơn
                    customer.Password = BCrypt.Net.BCrypt.HashPassword(request.Password);
                    _context.SaveChanges();
                }
            }
            else
            {
                // Kiểm tra bằng BCrypt
                isPasswordValid = BCrypt.Net.BCrypt.Verify(request.Password, customer.Password);
            }

            if (!isPasswordValid)
            {
                return Unauthorized(new { message = "Tài khoản hoặc mật khẩu không chính xác" });
            }

            // 3. Tạo JWT Token
            var tokenHandler = new JwtSecurityTokenHandler();
            var jwtKey = _configuration["Jwt:Key"] ?? "Duylution_Secret_Key_For_JWT_Authentication_12345!@#";
            var key = Encoding.ASCII.GetBytes(jwtKey);
            
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.NameIdentifier, customer.Id.ToString()),
                    new Claim(ClaimTypes.Email, customer.Email),
                    new Claim(ClaimTypes.Name, customer.FullName ?? ""),
                    new Claim("Role", "Customer")
                }),
                Expires = DateTime.UtcNow.AddDays(7), // Token có hiệu lực 7 ngày
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            return Ok(new 
            { 
                message = "Đăng nhập thành công", 
                isAdmin = false,
                token = tokenString, // Trả về Token thay vì toàn bộ Object
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

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpPut("UpdateProfile")]
        public IActionResult UpdateProfile([FromBody] UpdateProfileRequest request)
        {
            // Trích xuất UserId từ JWT thay vì tin tưởng ID từ Request Body
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int tokenUserId))
            {
                return Unauthorized(new { message = "Không xác định được danh tính" });
            }

            var customer = _context.Customers.Find(tokenUserId);
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
                // Băm mật khẩu mới
                customer.Password = BCrypt.Net.BCrypt.HashPassword(request.Password);
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
