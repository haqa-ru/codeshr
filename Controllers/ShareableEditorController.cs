using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.IO;
using Codeshr.Models;

namespace Codeshr.Controllers
{
    [Route("api/share")]
    [ApiController]
    public class ShareableEditorController : ControllerBase
    {
        private readonly ILogger<ShareableEditorController> _logger;
        private readonly string _private;

        public ShareableEditorController(IWebHostEnvironment env, ILogger<ShareableEditorController> logger)
        {
            _private = Path.Combine(env.ContentRootPath, "Private");
            _logger = logger;

            if (!Directory.Exists(_private))
            {
                Directory.CreateDirectory(_private);
            }
        }

        [HttpGet("{id}")]
        public IActionResult Get(string id)
        {
            try
            {
                var data = JsonSerializer.Deserialize<ShareableEditorModel>(System.IO.File.ReadAllText(Path.Combine(_private, id)));

                return Ok(data);
            }
            catch (FileNotFoundException) {
                return NotFound();
            }
            catch
            {
                return Problem(statusCode: StatusCodes.Status500InternalServerError);
            }
        }

        [HttpPost("")]
        public IActionResult Post([FromBody]ShareableEditorModel editor)
        {
            try
            {
                Random random = new Random();
                byte[] id = new byte[editor.Secure ? 8 : 2];
                do
                {
                    random.NextBytes(id);
                } while (System.IO.File.Exists(Path.Combine(_private, Convert.ToHexString(id, 0, id.Length))));

                editor.Id = Convert.ToHexString(id, 0, id.Length);

                string data = JsonSerializer.Serialize(editor);

                System.IO.File.WriteAllText(Path.Combine(_private, editor.Id), data);

                return Ok(editor);
            }
            catch
            {
                return Problem(statusCode: 500);
            }
        }

        [HttpPut("{id}")]
        public IActionResult Put(string id, [FromBody]ShareableEditorModel body)
        {
            try
            {
                var data = JsonSerializer.Deserialize<ShareableEditorModel>(System.IO.File.ReadAllText(Path.Combine(_private, id)));
                data.Lang = body.Lang;
                data.Code = body.Code;

                System.IO.File.WriteAllText(Path.Combine(_private, id), JsonSerializer.Serialize(data));

                return Ok(data);
            }
            catch (FileNotFoundException)
            {
                return NotFound();
            }
            catch
            {
                return Problem(statusCode: StatusCodes.Status500InternalServerError);
            }
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(string id)
        {
            try
            {
                System.IO.File.Delete(Path.Combine(_private, id));

                return Ok();
            }
            catch
            {
                return Problem(statusCode: StatusCodes.Status500InternalServerError);
            }
        }
    }
}