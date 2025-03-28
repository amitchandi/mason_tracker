using Microsoft.EntityFrameworkCore;
using MasonTracker.Api.Data;
using MasonTracker.Api.Models;
using MasonTracker.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<ApiKeyService>();

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
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    db.Database.EnsureCreated();
}

// Endpoints
app.MapGet("/records/today", async (ApplicationDbContext db) =>
{
    var today = DateTime.UtcNow.ToString("yyyy-MM-dd");
    return await db.DogWalkingRecords
        .FirstOrDefaultAsync(r => r.Date == today);
});

app.MapPost("/records", async (DogWalkingRecord record, ApplicationDbContext db) =>
{
    var existingRecord = await db.DogWalkingRecords
        .FirstOrDefaultAsync(r => r.Date == record.Date);

    if (existingRecord != null)
    {
        existingRecord.Fed = record.Fed;
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

app.MapGet("/records/week", async (ApplicationDbContext db) =>
{
    var today = DateTime.UtcNow.ToString("yyyy-MM-dd");
    var weekAgo = DateTime.UtcNow.AddDays(-7).ToString("yyyy-MM-dd");
    
    return await db.DogWalkingRecords
        .Where(r => r.Date.CompareTo(weekAgo) >= 0)
        .OrderByDescending(r => r.Date)
        .ToListAsync();
});

app.MapPost("/api/generate", async (ApiKeyService apiKeyService) =>
{
    var key = await apiKeyService.GenerateAndSaveKeyAsync();
    return Results.Ok(new { key });
});

app.Run();
