using CMS.Data;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using Cms.data.Entities;

namespace CMS.BA.Controllers
{
    [Route("api/Products")]
    [ApiController]
    public class ProductsAPIController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProductsAPIController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var products = _context.Products
                .Include(p => p.CategoryProduct)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.Description,
                    p.StockQuantity,
                    p.ImageUrl,
                    CategoryProduct = p.CategoryProduct == null ? null : new
                    {
                        p.CategoryProduct.Id,
                        p.CategoryProduct.Name
                    }
                })
                .ToList();

            return Ok(products);
        }

        [HttpGet("category/{categoryProductId}")]
        public IActionResult GetByCategory(int categoryProductId)
        {
            var products = _context.Products
                .Include(p => p.CategoryProduct)
                .Where(p => p.CategoryProductId == categoryProductId)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.Description,
                    p.StockQuantity,
                    p.ImageUrl,
                    CategoryProduct = p.CategoryProduct == null ? null : new
                    {
                        p.CategoryProduct.Id,
                        p.CategoryProduct.Name
                    }
                })
                .ToList();

            return Ok(products);
        }

        [HttpGet("{id}")]
        public IActionResult GetDetail(int id)
        {
            var product = _context.Products
                .Include(p => p.CategoryProduct)
                .Where(p => p.Id == id)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.Description,
                    p.StockQuantity,
                    p.ImageUrl,
                    CategoryProduct = p.CategoryProduct == null ? null : new
                    {
                        p.CategoryProduct.Id,
                        p.CategoryProduct.Name
                    }
                })
                .FirstOrDefault();

            if (product == null)
            {
                return NotFound(new { message = "Không tìm thấy sản phẩm" });
            }

            return Ok(product);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Product model)
        {
            _context.Products.Add(model);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Thêm sản phẩm thành công", data = model });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Product model)
        {
            if (id != model.Id)
            {
                return BadRequest(new { message = "ID không khớp" });
            }

            var exists = await _context.Products.AsNoTracking().FirstOrDefaultAsync(p => p.Id == id);
            if (exists == null)
            {
                return NotFound(new { message = "Không tìm thấy bản ghi" });
            }

            _context.Products.Update(model);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Cập nhật thành công", data = model });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var existing = await _context.Products.FindAsync(id);
            if (existing == null)
            {
                return NotFound(new { message = "Không tìm thấy bản ghi" });
            }

            _context.Products.Remove(existing);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Xóa thành công" });
        }
    }
}
