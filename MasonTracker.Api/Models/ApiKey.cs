using System.ComponentModel.DataAnnotations;

namespace MasonTracker.Api.Models;

public class ApiKey
{
    [Key]
    public string Key { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public bool IsActive { get; set; } = true;
} 