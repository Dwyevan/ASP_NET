using CMS.Data;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using Cms.data.Entities;

namespace CMS.BA.Controllers
{
    [Route("api/categories")]
    [ApiController]
    public class CategoriesAPIController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CategoriesAPIController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var categories = _context.Categories
                .Select(c => new {
                    c.Id,
                    c.Name,
                    c.Description
                })
                .ToList();

            return Ok(categories);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Category model)
        {
            if (id != model.Id)
            {
                return BadRequest(new { message = "ID không khớp" });
            }

            var exists = await _context.Categories.AsNoTracking().FirstOrDefaultAsync(p => p.Id == id);
            if (exists == null)
            {
                return NotFound(new { message = "Không tìm thấy bản ghi" });
            }

            _context.Categories.Update(model);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Cập nhật thành công", data = model });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var existing = await _context.Categories.FindAsync(id);
            if (existing == null)
            {
                return NotFound(new { message = "Không tìm thấy bản ghi" });
            }

            _context.Categories.Remove(existing);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Xóa thành công" });
        }
    }
}
