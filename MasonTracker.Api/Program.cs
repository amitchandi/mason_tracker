using Microsoft.EntityFrameworkCore;
using MasonTracker.Api.Data;
using MasonTracker.Api.Models;
using MasonTracker.Api.Services;
using Chandiman.CronScheduler;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")))
    .AddSingleton<IScheduledTask, DailyRecordTask>()
    .AddCronScheduler();

builder.Services
    .AddScoped<ApiKeyService>();

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
    var today = DateTime.Now.ToString("yyyy-MM-dd");
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
        existingRecord.UpdatedAt = DateTime.Now;
    }
    else
    {
        record.CreatedAt = DateTime.Now;
        record.UpdatedAt = DateTime.Now;
        db.DogWalkingRecords.Add(record);
    }

    await db.SaveChangesAsync();
    return existingRecord ?? record;
});

app.MapGet("/records/week", async (ApplicationDbContext db) =>
{
    var today = DateTime.Now.ToString("yyyy-MM-dd");
    var weekAgo = DateTime.Now.AddDays(-7).ToString("yyyy-MM-dd");
    
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

app.MapGet("/time", () => {
    return Results.Ok(DateTime.Now);
});

app.MapGet("/timeUTC", () => {
    return Results.Ok(DateTime.UtcNow);
});

app.MapDelete("/records", async (ApplicationDbContext db, IScheduledTask dailyRecordTask) => {
    await db.Database.EnsureDeletedAsync();
    await db.Database.EnsureCreatedAsync();
    await ((DailyRecordTask)dailyRecordTask).CreateDailyRecord(CancellationToken.None);
    return Results.Ok();
});

app.Run();
