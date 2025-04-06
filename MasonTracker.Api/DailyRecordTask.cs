using Chandiman.CronScheduler;
using MasonTracker.Api.Data;
using MasonTracker.Api.Models;
using Microsoft.EntityFrameworkCore;

public class DailyRecordTask : IScheduledTask
{
    public string Schedule => "1 0 * * *";
    private readonly IServiceProvider ServiceProvider;
    private readonly ILogger<DailyRecordTask> Logger;

    public DailyRecordTask(IServiceProvider serviceProvider, ILogger<DailyRecordTask> logger)
    {
        ServiceProvider = serviceProvider;
        Logger = logger;
    }

    public async Task ExecuteAsync(CancellationToken cancellationToken)
    {
        await CreateDailyRecord(cancellationToken);
    }
    private async Task CreateDailyRecord(CancellationToken cancellationToken)
    {
        using var scope = ServiceProvider.CreateScope();
        var _db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        
        var today = DateTime.UtcNow.Date.ToString("yyyy-MM-dd");
        Logger.LogInformation("Creating record for: " + today);
        // Check if a record for today already exists
        var existingRecord = await _db.DogWalkingRecords
            .Where(dw => dw.Date == today)
            .FirstOrDefaultAsync();
        if (existingRecord == null)
        {
            // Create a new record
            await _db.DogWalkingRecords.AddAsync(new DogWalkingRecord
            {
                Date = today,
                Walked = false,
                Pooped = false,
                Fed = false,
                WalkedBy = "nobody"
            });
            await _db.SaveChangesAsync();
        }
    }
}
