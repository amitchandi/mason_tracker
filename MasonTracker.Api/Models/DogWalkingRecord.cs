using System.ComponentModel.DataAnnotations;

namespace MasonTracker.Api.Models;

public class DogWalkingRecord
{
    public int Id { get; set; }
    
    [Required]
    public string Date { get; set; } = string.Empty;
    
    public bool Walked { get; set; }
    
    public bool Pooped { get; set; }
    
    public string? WalkedBy { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
} 