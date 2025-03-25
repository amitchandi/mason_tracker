using Microsoft.EntityFrameworkCore;
using MasonTracker.Api.Models;

namespace MasonTracker.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<DogWalkingRecord> DogWalkingRecords { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<DogWalkingRecord>()
            .HasIndex(r => r.Date)
            .IsUnique();
    }
} 