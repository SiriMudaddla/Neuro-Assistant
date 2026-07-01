$ErrorActionPreference = 'Stop'

$root = Join-Path $PWD 'neuro-assistant'
$proj = Join-Path $root 'NeuroAssistantApp'

New-Item -ItemType Directory -Force -Path $root | Out-Null
Set-Location $root

dotnet new web -n NeuroAssistantApp -f net8.0 --no-https

Set-Location $proj
New-Item -ItemType Directory -Force -Path Controllers, Services, Models, wwwroot, data | Out-Null

@'
using System.Text.Json;
using NeuroAssistantApp.Services;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddSingleton<TextProcessingService>();
builder.Services.AddSingleton<FlashcardService>();
builder.Services.AddSingleton<FocusService>();

var app = builder.Build();
app.UseDefaultFiles();
app.UseStaticFiles();

app.MapGet("/api/health", () => Results.Ok(new { ok = true, app = "Neuro Assistant" }));

app.MapPost("/api/summary", (StudyRequest req, TextProcessingService textService) =>
{
    var summary = textService.GenerateSummary(req.Text ?? string.Empty);
    return Results.Ok(new { summary });
});

app.MapPost("/api/terms", (StudyRequest req, TextProcessingService textService) =>
{
    var terms = textService.ExtractKeyTerms(req.Text ?? string.Empty);
    return Results.Ok(new { terms });
});

app.MapPost("/api/flashcards", (StudyRequest req, FlashcardService flashcardService) =>
{
    var cards = flashcardService.GenerateFlashcards(req.Text ?? string.Empty);
    return Results.Ok(new { cards });
});

app.MapPost("/api/focus-session", (FocusRequest req, FocusService focusService) =>
{
    var session = focusService.CreateSession(req.Minutes <= 0 ? 15 : req.Minutes);
    return Results.Ok(session);
});

app.MapPost("/api/save-study-set", async (StudySetRequest req) =>
{
    var file = Path.Combine("data", "study-sets.json");
    var payload = new
    {
        title = req.Title ?? "Untitled",
        text = req.Text ?? string.Empty,
        savedAt = DateTimeOffset.UtcNow
    };

    List<object> items = new();
    if (File.Exists(file))
    {
        var existing = await File.ReadAllTextAsync(file);
        if (!string.IsNullOrWhiteSpace(existing))
            items = JsonSerializer.Deserialize<List<object>>(existing) ?? new List<object>();
    }

    items.Add(payload);
    Directory.CreateDirectory("data");
    await File.WriteAllTextAsync(file, JsonSerializer.Serialize(items, new JsonSerializerOptions { WriteIndented = true }));
    return Results.Ok(new { saved = true });
});

app.Run();

record StudyRequest(string? Text);
record StudySetRequest(string? Title, string? Text);
record FocusRequest(int Minutes);
