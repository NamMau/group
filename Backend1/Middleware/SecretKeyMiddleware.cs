using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;

namespace Backend1.Middleware
{
    public class SecretKeyMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly string _apiSecretKey;

        public SecretKeyMiddleware(RequestDelegate next, IConfiguration configuration)
        {
            _next = next;
            _apiSecretKey = configuration["Api:SecretKey"]; // Read API key from config
        }

        public async Task Invoke(HttpContext context)
        {
            if (!context.Request.Headers.TryGetValue("ApiKey", out var extractedApiKey))
            {
                context.Response.StatusCode = 401; // Unauthorized
                await context.Response.WriteAsync("API Key is missing.");
                return;
            }

            if (_apiSecretKey != extractedApiKey)
            {
                context.Response.StatusCode = 401; // Unauthorized
                await context.Response.WriteAsync("Invalid API Key.");
                return;
            }

            await _next(context); // Continue processing the request
        }
    }
}
