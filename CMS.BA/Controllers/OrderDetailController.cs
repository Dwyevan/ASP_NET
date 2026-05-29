using CMS.Data;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Backend.Controllers
{
    [Microsoft.AspNetCore.Authorization.Authorize]
    public class OrderDetailController
        : Controller
    {
        private readonly ApplicationDbContext _context;

        public OrderDetailController(
            ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            return View(
                _context.OrderDetails.ToList()
            );
        }
    }
}