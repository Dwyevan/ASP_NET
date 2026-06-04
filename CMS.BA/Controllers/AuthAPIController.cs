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

            var customer = _context.Customers
                .FirstOrDefault(c => c.Email == request.Email && c.Password == request.Password);

            if (customer == null)
            {
                return Unauthorized(new { message = "Email hoặc mật khẩu không chính xác" });
            }

            return Ok(new 
            { 
                message = "Đăng nhập thành công", 
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
