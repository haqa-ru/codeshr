using Codeshr.Models;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using Microsoft.Extensions.FileProviders;
using Microsoft.AspNetCore.StaticFiles;

namespace Codeshr.Controllers
{
    [Controller]
    [Route("/")]
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly IWebHostEnvironment _env;

        public HomeController(IWebHostEnvironment env, ILogger<HomeController> logger)
        {
            _env = env;
            _logger = logger;
        }

        public IActionResult Index()
        {
            try
            {
                return new ContentResult
                {
                    ContentType = "text/html",
                    StatusCode = StatusCodes.Status200OK,
                    Content = System.IO.File.ReadAllText(Path.Combine(_env.WebRootPath, "index.html"))
                };
            }
            catch
            {
                return Problem(statusCode: StatusCodes.Status500InternalServerError);
            }
        }

        [HttpGet("{id}")]
        public IActionResult Index(string id)
        {
            try
            {
                if (System.IO.File.Exists(Path.Combine(_env.WebRootPath, id)))
                {
                    FileStream fs = new FileStream(Path.Combine(_env.WebRootPath, id), FileMode.Open);
                    FileExtensionContentTypeProvider provider = new FileExtensionContentTypeProvider();
                    return File(fs, provider.Mappings[Path.GetExtension(id)], id);
                }

                return new ContentResult
                {
                    ContentType = "text/html",
                    StatusCode = StatusCodes.Status200OK,
                    Content = System.IO.File.ReadAllText(Path.Combine(_env.WebRootPath, "index.html"))
                };
            }
            catch
            {
                return Problem(statusCode: StatusCodes.Status500InternalServerError);
            }
        }
    }
}