using CMS.Data;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Backend.Controllers
{
    public class CustomerController
        : Controller
    {
        private readonly ApplicationDbContext _context;

        public CustomerController(
            ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            return View(
                _context.Customers.ToList()
            );
        }
    }
}