using CMS.Data;
using Cms.data.Entities; // Giữ nguyên cách đặt tên namespace hiện tại của bạn
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;

namespace CMS.Backend.Controllers
{
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
        public IActionResult Index()
        {
            var posts = _context.Posts
                .Include(x => x.Category)
                .ToList();

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
        public IActionResult Create(Post model)
        {
            // Loại bỏ thuộc tính liên kết bảng khỏi danh sách kiểm tra validate
            ModelState.Remove("Category");

            if (ModelState.IsValid)
            {
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
        public IActionResult Edit(Post model)
        {
            // SỬA LỖI TẠI ĐÂY: Ép buộc bỏ qua việc kiểm tra trường liên kết 'Category' bị null
            ModelState.Remove("Category");

            if (ModelState.IsValid)
            {
                _context.Posts.Update(model);
                _context.SaveChanges();
                return RedirectToAction("Index");
            }

            // Nếu dữ liệu bị lỗi khác, nạp lại danh sách Category cho Dropdown
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