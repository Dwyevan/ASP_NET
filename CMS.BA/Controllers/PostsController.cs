using CMS.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using Cms.data.Entities;

namespace CMS.BA.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PostsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/posts
        [HttpGet]
        public IActionResult GetAll()
        {
            var posts = _context.Posts
                .Include(p => p.Category)
                .OrderByDescending(p => p.CreatedDate)
                .Select(p => new {
                    p.Id,
                    p.Title,
                    p.ImageUrl,
                    p.CreatedDate,
                    CategoryName = p.Category != null ? p.Category.Name : "Không có"
                })
                .ToList();

            return Ok(posts);
        }

        // GET: api/posts/category/{categoryId}
        [HttpGet("category/{categoryId}")]
        public IActionResult GetByCategory(int categoryId)
        {
            var posts = _context.Posts
                .Include(p => p.Category)
                .Where(p => p.CategoryId == categoryId)
                .OrderByDescending(p => p.CreatedDate)
                .Select(p => new {
                    p.Id,
                    p.Title,
                    p.ImageUrl,
                    p.CreatedDate,
                    CategoryName = p.Category != null ? p.Category.Name : "Không có"
                })
                .ToList();

            return Ok(posts);
        }

        // GET: api/posts/{id}
        [HttpGet("{id}")]
        public IActionResult GetDetail(int id)
        {
            var post = _context.Posts
                .Include(p => p.Category)
                .FirstOrDefault(p => p.Id == id);

            if (post == null)
            {
                return NotFound(new { message = "Không tìm thấy bài viết này trong hệ thống" });
            }

            return Ok(post);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Post model)
        {
            if (id != model.Id)
            {
                return BadRequest(new { message = "ID không khớp" });
            }

            var exists = await _context.Posts.AsNoTracking().FirstOrDefaultAsync(p => p.Id == id);
            if (exists == null)
            {
                return NotFound(new { message = "Không tìm thấy bản ghi" });
            }

            _context.Posts.Update(model);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Cập nhật thành công", data = model });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var existing = await _context.Posts.FindAsync(id);
            if (existing == null)
            {
                return NotFound(new { message = "Không tìm thấy bản ghi" });
            }

            _context.Posts.Remove(existing);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Xóa thành công" });
        }
    }
}
