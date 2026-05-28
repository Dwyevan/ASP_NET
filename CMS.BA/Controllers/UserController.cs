using CMS.Data;
using Cms.data.Entities;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace CMS.BA.Controllers
{
    public class UserController : Controller
    {
        private readonly ApplicationDbContext _context;

        public UserController(
            ApplicationDbContext context)
        {
            _context = context;
        }

        //-----------------------------------
        // HIỂN THỊ DANH SÁCH USER
        //-----------------------------------

        public IActionResult Index()
        {
            var users =
                _context.Users.ToList();

            return View(users);
        }

        //-----------------------------------
        // CREATE USER
        //-----------------------------------

        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Create(User model)
        {
            if (ModelState.IsValid)
            {
                _context.Users.Add(model);

                _context.SaveChanges();

                return RedirectToAction("Index");
            }

            return View(model);
        }

        //-----------------------------------
        // EDIT USER
        //-----------------------------------

        [HttpGet]
        public IActionResult Edit(int id)
        {
            var user =
                _context.Users.Find(id);

            if (user == null)
            {
                return NotFound();
            }

            return View(user);
        }

        [HttpPost]
        public IActionResult Edit(User model)
        {
            if (ModelState.IsValid)
            {
                _context.Users.Update(model);

                _context.SaveChanges();

                return RedirectToAction("Index");
            }

            return View(model);
        }

        //-----------------------------------
        // DELETE USER
        //-----------------------------------

        public IActionResult Delete(int id)
        {
            var user =
                _context.Users.Find(id);

            if (user != null)
            {
                _context.Users.Remove(user);

                _context.SaveChanges();
            }

            return RedirectToAction("Index");
        }

    }
}