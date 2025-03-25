using Microsoft.EntityFrameworkCore;
using MasonTracker.Api.Data;
using MasonTracker.Api.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors();

// Ensure database is created
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

// Endpoints
app.MapGet("/records/today", async (AppDbContext db) =>
{
    var today = DateOnly.FromDateTime(DateTime.UtcNow);
    return await db.DogWalkingRecords
        .FirstOrDefaultAsync(r => r.Date == today);
});

app.MapPost("/records", async (DogWalkingRecord record, AppDbContext db) =>
{
    var existingRecord = await db.DogWalkingRecords
        .FirstOrDefaultAsync(r => r.Date == record.Date);

    if (existingRecord != null)
    {
        existingRecord.Walked = record.Walked;
        existingRecord.Pooped = record.Pooped;
        existingRecord.WalkedBy = record.WalkedBy;
        existingRecord.UpdatedAt = DateTime.UtcNow;
    }
    else
    {
        record.CreatedAt = DateTime.UtcNow;
        record.UpdatedAt = DateTime.UtcNow;
        db.DogWalkingRecords.Add(record);
    }

    await db.SaveChangesAsync();
    return existingRecord ?? record;
});

app.MapGet("/records/week", async (AppDbContext db) =>
{
    var today = DateOnly.FromDateTime(DateTime.UtcNow);
    var weekAgo = today.AddDays(-7);
    
    return await db.DogWalkingRecords
        .Where(r => r.Date >= weekAgo)
        .OrderByDescending(r => r.Date)
        .ToListAsync();
});

app.Run();
