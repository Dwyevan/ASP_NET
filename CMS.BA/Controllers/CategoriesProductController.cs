using CMS.Data;
using Cms.data.Entities; // Bắt buộc: Thêm dòng này để gọi được thực thể CategoryProduct
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace CMS.Backend.Controllers
{
    public class CategoriesProductController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CategoriesProductController(ApplicationDbContext context)
        {
            _context = context;
        }

        //--------------------------------------------------
        // 1. HIỂN THỊ DANH SÁCH DANH MỤC (INDEX)
        //--------------------------------------------------
        public IActionResult Index()
        {
            var data = _context.CategoriesProducts.ToList();
            return View(data);
        }

        //--------------------------------------------------
        // 2. THÊM MỚI DANH MỤC (GET)
        //--------------------------------------------------
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        //--------------------------------------------------
        // 3. THÊM MỚI DANH MỤC (POST)
        //--------------------------------------------------
        [HttpPost]
        public IActionResult Create(CategoryProduct model)
        {
            // Bỏ qua kiểm tra danh sách sản phẩm liên kết để tránh lỗi form chặn không cho lưu
            ModelState.Remove("Products");

            if (ModelState.IsValid)
            {
                _context.CategoriesProducts.Add(model);
                _context.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(model);
        }

        //--------------------------------------------------
        // 4. SỬA DANH MỤC (GET)
        //--------------------------------------------------
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var category = _context.CategoriesProducts.Find(id);
            if (category == null)
            {
                return NotFound();
            }
            return View(category);
        }

        //--------------------------------------------------
        // 5. SỬA DANH MỤC (POST)
        //--------------------------------------------------
        [HttpPost]
        public IActionResult Edit(CategoryProduct model)
        {
            ModelState.Remove("Products");

            if (ModelState.IsValid)
            {
                _context.CategoriesProducts.Update(model);
                _context.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(model);
        }

        //--------------------------------------------------
        // 6. XÓA DANH MỤC (DELETE)
        //--------------------------------------------------
        public IActionResult Delete(int id)
        {
            var category = _context.CategoriesProducts.Find(id);
            if (category != null)
            {
                _context.CategoriesProducts.Remove(category);
                _context.SaveChanges();
            }
            return RedirectToAction("Index");
        }
    }
}