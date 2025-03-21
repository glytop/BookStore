using Microsoft.AspNetCore.Mvc;

namespace WebTesterOfBookStore.Controllers
{
    public class LibraryController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
