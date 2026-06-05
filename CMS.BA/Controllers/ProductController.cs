using CMS.Data;
using Cms.data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; // BẮT BUỘC: Để sử dụng hàm .Include() liên kết dữ liệu bảng
using System.Linq;
using System.IO;
using System;
using Microsoft.AspNetCore.Http;

using Microsoft.AspNetCore.Authorization;

namespace CMS.Backend.Controllers
{
    [Authorize]
    public class ProductController : Controller
    {
        private readonly ApplicationDbContext _context;

        public ProductController(ApplicationDbContext context)
        {
            _context = context;
        }

        //--------------------------------------------------
        // 1. HIỂN THỊ DANH SÁCH + TÌM KIẾM SẢN PHẨM (INDEX)
        //--------------------------------------------------
        public IActionResult Index(string keyword)
        {
            // Thêm .Include để nạp thực thể danh mục kèm theo sản phẩm, hiển thị tên chữ ra ngoài view
            var products = _context.Products
                .Include(x => x.CategoryProduct)
                .AsQueryable();

            if (!string.IsNullOrEmpty(keyword))
            {
                products = products.Where(x => x.Name.Contains(keyword));
            }

            return View(products.ToList());
        }

        //--------------------------------------------------
        // 2. CHỨC NĂNG THÊM MỚI SẢN PHẨM (GET)
        //--------------------------------------------------
        [HttpGet]
        public IActionResult Create()
        {
            // Nạp danh sách danh mục lên ViewBag để đổ vào dropdown select-option ngoài view
            ViewBag.CategoriesProducts = _context.CategoriesProducts.ToList();
            return View();
        }

        //--------------------------------------------------
        // 3. CHỨC NĂNG THÊM MỚI SẢN PHẨM (POST)
        //--------------------------------------------------
        [HttpPost]
        public IActionResult Create(Product model, IFormFile? uploadImage)
        {
            // FIX LỖI CHẶN NÚT LƯU: Loại bỏ kiểm tra các thuộc tính liên kết bảng bị null trên form
            ModelState.Remove("CategoryProduct");
            ModelState.Remove("OrderDetails");

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

                _context.Products.Add(model);
                _context.SaveChanges(); // Lưu xuống SQL Server

                return RedirectToAction("Index"); // Thành công quay về trang danh sách
            }

            // Nếu form lỗi, nạp lại danh mục tránh bị trắng/lỗi Dropdown khi load lại trang
            ViewBag.CategoriesProducts = _context.CategoriesProducts.ToList();
            return View(model);
        }

        //--------------------------------------------------
        // 4. CHỨC NĂNG SỬA SẢN PHẨM (GET - LẤY DỮ LIỆU CŨ)
        //--------------------------------------------------
        [HttpGet]
        public IActionResult Edit(int id)
        {
            // Tìm sản phẩm trong DB theo mã ID truyền lên
            var product = _context.Products.Find(id);
            if (product == null)
            {
                return NotFound();
            }

            // Nạp danh sách danh mục để đổ vào ô Dropdown chọn lại nếu muốn đổi loại danh mục
            ViewBag.CategoriesProducts = _context.CategoriesProducts.ToList();
            return View(product);
        }

        //--------------------------------------------------
        // 5. CHỨC NĂNG SỬA SẢN PHẨM (POST - LƯU CẬP NHẬT)
        //--------------------------------------------------
        [HttpPost]
        public IActionResult Edit(Product model, IFormFile? uploadImage)
        {
            // Loại bỏ kiểm tra thuộc tính liên kết bảng tránh lỗi xác thực ModelState.IsValid bị false
            ModelState.Remove("CategoryProduct");
            ModelState.Remove("OrderDetails");

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
                    var existingProduct = _context.Products.AsNoTracking().FirstOrDefault(p => p.Id == model.Id);
                    if (existingProduct != null && string.IsNullOrEmpty(model.ImageUrl))
                    {
                        model.ImageUrl = existingProduct.ImageUrl;
                    }
                }

                _context.Products.Update(model); // Cập nhật thực thể dữ liệu mới thay cho bản cũ
                _context.SaveChanges();           // Đẩy lệnh UPDATE chạy xuống SQL Server

                return RedirectToAction("Index"); // Lưu xong quay về trang danh sách để check kết quả
            }

            // Nếu dữ liệu cập nhật không hợp lệ, nạp lại danh mục để giữ nguyên trạng thái form cho người dùng sửa tiếp
            ViewBag.CategoriesProducts = _context.CategoriesProducts.ToList();
            return View(model);
        }

        //--------------------------------------------------
        // 6. CHỨC NĂNG XÓA SẢN PHẨM (DELETE)
        //--------------------------------------------------
        public IActionResult Delete(int id)
        {
            // Tìm sản phẩm cần xóa trong hệ thống
            var product = _context.Products.Find(id);

            if (product != null)
            {
                _context.Products.Remove(product); // Đánh dấu xóa thực thể
                _context.SaveChanges();            // Chạy lệnh DELETE thực tế dưới database
            }

            // Xóa xong quay trở lại danh sách trang sản phẩm
            return RedirectToAction("Index");
        }

        //--------------------------------------------------
        // 7. CHỨC NĂNG XEM CHI TIẾT SẢN PHẨM (DETAILS)
        //--------------------------------------------------
        [HttpGet]
        public IActionResult Details(int id)
        {
            var product = _context.Products
                .Include(x => x.CategoryProduct)
                .FirstOrDefault(x => x.Id == id);

            if (product == null)
            {
                return NotFound();
            }
            return View(product);
        }
    }
}