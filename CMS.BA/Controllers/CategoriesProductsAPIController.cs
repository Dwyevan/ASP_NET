using CMS.Data;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using Cms.data.Entities;

namespace CMS.BA.Controllers
{
    [Route("api/CategoriesProducts")]
    [ApiController]
    public class CategoriesProductsAPIController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CategoriesProductsAPIController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var categories = _context.CategoriesProducts
                .Select(c => new
                {
                    c.Id,
                    c.Name,
                    c.Description
                })
                .ToList();

            return Ok(categories);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CategoryProduct model)
        {
            _context.CategoriesProducts.Add(model);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Thêm danh mục thành công", data = model });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CategoryProduct model)
        {
            if (id != model.Id)
            {
                return BadRequest(new { message = "ID không khớp" });
            }

            var exists = await _context.CategoriesProducts.AsNoTracking().FirstOrDefaultAsync(p => p.Id == id);
            if (exists == null)
            {
                return NotFound(new { message = "Không tìm thấy bản ghi" });
            }

            _context.CategoriesProducts.Update(model);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Cập nhật thành công", data = model });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var existing = await _context.CategoriesProducts.FindAsync(id);
            if (existing == null)
            {
                return NotFound(new { message = "Không tìm thấy bản ghi" });
            }

            _context.CategoriesProducts.Remove(existing);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Xóa thành công" });
        }
    }
}
