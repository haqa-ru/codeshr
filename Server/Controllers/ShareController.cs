using System.Security.Cryptography;
using System.Text.Json;
using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.AspNetCore.Mvc;
using Server.Models;

namespace Server.Controllers;

[ApiController]
[Route("api/share")]
public class ShareController : ControllerBase {
    private readonly string _bucketName;
    private readonly AmazonS3Client _client;
    private readonly ILogger<ShareController> _logger;

    public ShareController(ILogger<ShareController> logger) {
        _logger = logger;
        _client = new AmazonS3Client(new AmazonS3Config {
            ServiceURL = "https://s3.yandexcloud.net"
        });
        _bucketName = Environment.GetEnvironmentVariable("BUCKET_NAME") ?? "default";
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(string id) {
        try {
            var response = await _client.GetObjectAsync(new GetObjectRequest {
                BucketName = _bucketName,
                Key = id
            });

            var dataStream = new StreamReader(response.ResponseStream);

            var data = JsonSerializer.Deserialize<ShareModel>(await dataStream.ReadToEndAsync());

            if (data is null) {
                throw new JsonException();
            }

            _logger.LogInformation($"{id}/GET: Ok.");

            return Ok(new { data.Code, data.Language, data.Secure });
        }
        catch (AmazonS3Exception e) {
            _logger.LogWarning($"{id}/GET: {e.Message}");
            return StatusCode((int)e.StatusCode);
        }
        catch {
            _logger.LogWarning($"{id}/GET: Undefined behavior.");
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] ShareModel body) {
        try {
            body.Id = Convert.ToHexString(RandomNumberGenerator.GetBytes(body.Secure ? 6 : 2));
            body.Secret = Convert.ToBase64String(RandomNumberGenerator.GetBytes(32));
            body.Date = DateTime.Now;

            var stream = new MemoryStream();

            await JsonSerializer.SerializeAsync(stream, body);

            await _client.PutObjectAsync(new PutObjectRequest {
                BucketName = _bucketName,
                Key = body.Id,
                InputStream = stream,
                ContentType = "application/json"
            });

            _logger.LogInformation($"{body.Id}/POST: Ok.");

            return Ok(body);
        }
        catch (AmazonS3Exception e) {
            _logger.LogWarning($"{body.Id}/POST: {e.Message}");
            return StatusCode((int)e.StatusCode);
        }
        catch {
            _logger.LogError($"{body.Id}/POST: Undefined behavior.");
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(string id, [FromBody] ShareModel body) {
        try {
            var response = await _client.GetObjectAsync(new GetObjectRequest {
                BucketName = _bucketName,
                Key = id
            });

            var dataStream = new StreamReader(response.ResponseStream);

            var data = JsonSerializer.Deserialize<ShareModel>(await dataStream.ReadToEndAsync());

            if (data is null) {
                throw new JsonException();
            }

            if (body.Secret != data.Secret) {
                return StatusCode(StatusCodes.Status403Forbidden);
            }

            body.Date = new DateTime();

            var stream = new MemoryStream();

            await JsonSerializer.SerializeAsync(stream, body);

            await _client.PutObjectAsync(new PutObjectRequest {
                BucketName = _bucketName,
                Key = $"private/{body.Id}",
                InputStream = stream,
                ContentType = "application/json"
            });

            _logger.LogInformation($"{id}/PUT: Ok.");

            return Ok(body);
        }
        catch (AmazonS3Exception e) {
            _logger.LogWarning($"{id}/PUT: {e.Message}");
            return StatusCode((int)e.StatusCode);
        }
        catch {
            _logger.LogError($"{id}/PUT: Undefined behavior.");
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id, string secret) {
        try {
            var response = await _client.GetObjectAsync(new GetObjectRequest {
                BucketName = _bucketName,
                Key = id
            });

            var dataStream = new StreamReader(response.ResponseStream);

            var data = JsonSerializer.Deserialize<ShareModel>(await dataStream.ReadToEndAsync());

            if (data is null) {
                throw new JsonException();
            }

            if (secret != data.Secret) {
                return StatusCode(StatusCodes.Status403Forbidden);
            }

            await _client.DeleteObjectAsync(new DeleteObjectRequest {
                BucketName = _bucketName,
                Key = id
            });

            _logger.LogInformation($"{id}/DELETE: Ok.");

            return Ok();
        }
        catch (AmazonS3Exception e) {
            _logger.LogWarning($"{id}/DELETE: {e.Message}");
            return StatusCode((int)e.StatusCode);
        }
        catch {
            _logger.LogError($"{id}/GET: Undefined behavior.");
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }
}