using CMS.Data;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Backend.Controllers
{
    public class CategoriesProductController
        : Controller
    {
        private readonly ApplicationDbContext _context;

        public CategoriesProductController(
            ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            var data =
                _context.CategoriesProducts
                .ToList();

            return View(data);
        }
    }
}