using CMS.Data;
using Cms.data.Entities; // Giữ nguyên cách đặt tên namespace hiện tại của bạn
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.IO;
using Microsoft.AspNetCore.Http;

using Microsoft.AspNetCore.Authorization;

namespace CMS.Backend.Controllers
{
    [Authorize]
    public class PostController : Controller
    {
        private readonly ApplicationDbContext _context;

        public PostController(ApplicationDbContext context)
        {
            _context = context;
        }

        //----------------------------------
        // HIỂN THỊ DANH SÁCH POST
        //----------------------------------
        public IActionResult Index(int? id)
        {
            var query = _context.Posts.Include(x => x.Category).AsQueryable();

            if (id.HasValue)
            {
                query = query.Where(p => p.CategoryId == id.Value);
            }

            var posts = query.OrderByDescending(p => p.CreatedDate).ToList();

            return View(posts);
        }

        //----------------------------------
        // CREATE POST
        //----------------------------------
        [HttpGet]
        public IActionResult Create()
        {
            ViewBag.Categories = _context.Categories.ToList();
            return View();
        }

        [HttpPost]
        public IActionResult Create(Post model, IFormFile? uploadImage)
        {
            // Loại bỏ thuộc tính liên kết bảng khỏi danh sách kiểm tra validate
            ModelState.Remove("Category");
            ModelState.Remove("ImageUrl");

            if (ModelState.IsValid)
            {
                if (uploadImage != null && uploadImage.Length > 0)
                {
                    var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
                    Directory.CreateDirectory(uploadsFolder);
                    var uniqueFileName = Guid.NewGuid().ToString() + "_" + uploadImage.FileName;
                    var filePath = Path.Combine(uploadsFolder, uniqueFileName);
                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        uploadImage.CopyTo(fileStream);
                    }
                    model.ImageUrl = "/uploads/" + uniqueFileName;
                }

                model.CreatedDate = DateTime.Now;
                _context.Posts.Add(model);
                _context.SaveChanges();
                return RedirectToAction("Index");
            }

            ViewBag.Categories = _context.Categories.ToList();
            return View(model);
        }

        //----------------------------------
        // EDIT POST
        //----------------------------------
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var post = _context.Posts.Find(id);

            if (post == null)
            {
                return NotFound();
            }

            ViewBag.Categories = _context.Categories.ToList();
            return View(post);
        }

        [HttpPost]
        public IActionResult Edit(Post model, IFormFile? uploadImage)
        {
            // SỬA LỖI TẠI ĐÂY: Ép buộc bỏ qua việc kiểm tra trường liên kết 'Category' bị null
            ModelState.Remove("Category");
            ModelState.Remove("ImageUrl");

            if (ModelState.IsValid)
            {
                if (uploadImage != null && uploadImage.Length > 0)
                {
                    var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
                    Directory.CreateDirectory(uploadsFolder);
                    var uniqueFileName = Guid.NewGuid().ToString() + "_" + uploadImage.FileName;
                    var filePath = Path.Combine(uploadsFolder, uniqueFileName);
                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        uploadImage.CopyTo(fileStream);
                    }
                    model.ImageUrl = "/uploads/" + uniqueFileName;
                }
                else
                {
                    var existingPost = _context.Posts.AsNoTracking().FirstOrDefault(p => p.Id == model.Id);
                    if (existingPost != null && string.IsNullOrEmpty(model.ImageUrl))
                    {
                        model.ImageUrl = existingPost.ImageUrl;
                    }
                }

                _context.Posts.Update(model);
                _context.SaveChanges();
                return RedirectToAction("Index");
            }

            // Nếu dữ liệu bị lỗi khác, nạp lại danh sách Category cho Dropdown và trả về View với model lỗi
            ViewBag.Categories = _context.Categories.ToList();
            return View(model);
        }

        //----------------------------------
        // DELETE POST
        //----------------------------------
        public IActionResult Delete(int id)
        {
            var post = _context.Posts.Find(id);

            if (post != null)
            {
                _context.Posts.Remove(post);
                _context.SaveChanges();
            }

            return RedirectToAction("Index");
        }

        //----------------------------------
        // DETAILS POST
        //----------------------------------
        public IActionResult Details(int id)
        {
            var post = _context.Posts
                .Include(x => x.Category)
                .FirstOrDefault(x => x.Id == id);

            if (post == null)
            {
                return NotFound();
            }

            return View(post);
        }
    }
}