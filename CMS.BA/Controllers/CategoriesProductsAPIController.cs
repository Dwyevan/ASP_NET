using CMS.Data;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

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
    }
}
