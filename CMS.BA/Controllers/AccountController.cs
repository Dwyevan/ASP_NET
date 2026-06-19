using CMS.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Security.Claims;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;

namespace CMS.BA.Controllers
{
    public class AccountController : Controller
    {
        private readonly ApplicationDbContext _context;

        public AccountController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Login()
        {
            if (User.Identity.IsAuthenticated)
            {
                return RedirectToAction("Index", "Product");
            }
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Login(string email, string password)
        {
            var user = _context.Users.FirstOrDefault(u => u.Username == email && u.PasswordHash == password);

            if (user != null)
            {
                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, user.Username),
                    new Claim(ClaimTypes.Role, user.Role ?? "Admin"),
                    new Claim("FullName", user.FullName ?? user.Username)
                };

                var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

                await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, 
                    new ClaimsPrincipal(claimsIdentity));

                return RedirectToAction("Index", "Product");
            }

            ViewBag.ErrorMessage = "Tên đăng nhập hoặc mật khẩu không chính xác!";
            return View();
        }

        [Authorize]
        [HttpGet]
        public IActionResult Profile()
        {
            var username = User.Identity?.Name;
            var user = _context.Users.FirstOrDefault(u => u.Username == username);
            if (user == null) return NotFound();
            
            return View(user);
        }

        [Authorize]
        [HttpPost]
        public IActionResult UpdateProfile(string fullName)
        {
            var username = User.Identity?.Name;
            var user = _context.Users.FirstOrDefault(u => u.Username == username);
            if (user != null)
            {
                user.FullName = fullName;
                _context.SaveChanges();
                TempData["SuccessMessage"] = "Cập nhật hồ sơ thành công!";
            }
            return RedirectToAction("Profile");
        }

        [Authorize]
        [HttpPost]
        public IActionResult ChangePassword(string oldPassword, string newPassword, string confirmPassword)
        {
            var username = User.Identity?.Name;
            var user = _context.Users.FirstOrDefault(u => u.Username == username);
            
            if (user != null)
            {
                if (user.PasswordHash != oldPassword)
                {
                    TempData["ErrorMessage"] = "Mật khẩu cũ không chính xác!";
                    return RedirectToAction("Profile");
                }
                
                if (newPassword != confirmPassword)
                {
                    TempData["ErrorMessage"] = "Mật khẩu mới và xác nhận không khớp!";
                    return RedirectToAction("Profile");
                }
                
                user.PasswordHash = newPassword;
                _context.SaveChanges();
                TempData["SuccessMessage"] = "Đổi mật khẩu thành công!";
            }
            return RedirectToAction("Profile");
        }

        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return RedirectToAction("Login");
        }

        [HttpGet]
        public IActionResult PageNotFound()
        {
            return View();
        }
    }
}