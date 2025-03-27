using System.Security.Cryptography;
using MasonTracker.Api.Data;
using MasonTracker.Api.Models;

namespace MasonTracker.Api.Services;

public class ApiKeyService
{
    private readonly ApplicationDbContext _context;

    public ApiKeyService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<string> GenerateAndSaveKeyAsync()
    {
        var key = GenerateKey();
        var apiKey = new ApiKey
        {
            Key = key,
            CreatedAt = DateTime.UtcNow,
            IsActive = true
        };

        _context.ApiKeys.Add(apiKey);
        await _context.SaveChangesAsync();

        return key;
    }

    public async Task<bool> ValidateKeyAsync(string key)
    {
        var apiKey = await _context.ApiKeys.FindAsync(key);
        return apiKey != null && apiKey.IsActive;
    }

    private string GenerateKey()
    {
        var key = new byte[32];
        using (var generator = RandomNumberGenerator.Create())
        {
            generator.GetBytes(key);
        }
        return Convert.ToBase64String(key);
    }
} 