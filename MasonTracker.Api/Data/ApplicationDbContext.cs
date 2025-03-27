using Microsoft.EntityFrameworkCore;
using MasonTracker.Api.Models;

namespace MasonTracker.Api.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<DogWalkingRecord> DogWalkingRecords { get; set; }
    public DbSet<ApiKey> ApiKeys { get; set; }
} 