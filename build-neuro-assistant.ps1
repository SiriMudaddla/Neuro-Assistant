$ErrorActionPreference = 'Stop'

$root = Join-Path $PWD 'neuro-assistant'
$proj = Join-Path $root 'NeuroAssistantApp'

New-Item -ItemType Directory -Force -Path $root | Out-Null
Set-Location $root

if (-not (Test-Path .\NeuroAssistantApp)) {
    dotnet new web -n NeuroAssistantApp -f net8.0 --no-https
}

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
        {
            items = JsonSerializer.Deserialize<List<object>>(existing) ?? new List<object>();
        }
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
'@ | Set-Content -Path Program.cs -Encoding UTF8

@'
namespace NeuroAssistantApp.Services;

public class TextProcessingService
{
    public string GenerateSummary(string text)
    {
        if (string.IsNullOrWhiteSpace(text))
            return "Paste study notes to generate a summary.";

        var sentences = SplitSentences(text).Take(3);
        return string.Join(" ", sentences);
    }

    public List<string> ExtractKeyTerms(string text)
    {
        if (string.IsNullOrWhiteSpace(text))
            return new List<string>();

        var words = text.Split(new[] { ' ', '\n', '\r', '\t', ',', '.', ';', ':', '!', '?', '(', ')', '[', ']', '{', '}' }, StringSplitOptions.RemoveEmptyEntries);

        return words
            .Select(w => w.Trim().ToLowerInvariant())
            .Where(w => w.Length > 5)
            .GroupBy(w => w)
            .OrderByDescending(g => g.Count())
            .Take(10)
            .Select(g => g.Key)
            .ToList();
    }

    private IEnumerable<string> SplitSentences(string text)
    {
        return text.Split(new[] { '.', '!', '?' }, StringSplitOptions.RemoveEmptyEntries)
                   .Select(s => s.Trim() + ".")
                   .Where(s => s.Length > 1);
    }
}
'@ | Set-Content -Path Services/TextProcessingService.cs -Encoding UTF8

@'
namespace NeuroAssistantApp.Services;

public class FlashcardService
{
    public List<object> GenerateFlashcards(string text)
    {
        if (string.IsNullOrWhiteSpace(text))
            return new List<object>();

        var sentences = text.Split(new[] { '.', '!', '?' }, StringSplitOptions.RemoveEmptyEntries)
            .Select(s => s.Trim())
            .Where(s => s.Length > 0)
            .Take(10)
            .ToList();

        var cards = new List<object>();

        foreach (var sentence in sentences)
        {
            var terms = sentence.Split(' ', StringSplitOptions.RemoveEmptyEntries);
            var front = terms.Length > 8 ? string.Join(" ", terms.Take(8)) + "..." : sentence;

            cards.Add(new
            {
                front,
                back = sentence,
                hint = "Tap to reveal"
            });
        }

        return cards;
    }
}
'@ | Set-Content -Path Services/FlashcardService.cs -Encoding UTF8

@'
namespace NeuroAssistantApp.Services;

public class FocusService
{
    public object CreateSession(int minutes)
    {
        return new
        {
            mode = "focus",
            minutes,
            soundscape = "calm-purple",
            tip = "Read in 15-minute bursts with a short break."
        };
    }
}
'@ | Set-Content -Path Services/FocusService.cs -Encoding UTF8

@'
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Neuro-Inclusive AI Assistant</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <div class="page-shell">
    <header class="topbar">
      <button class="theme-toggle" id="themeToggle" type="button">🌙 DARK MODE</button>
    </header>

    <main class="app-wrap">
      <h1 class="hero-title">NEURO-INCLUSIVE AI ASSISTANT</h1>

      <section class="notes-card">
        <div class="notes-header">
          <div>
            <h2>Study Material / Notes</h2>
            <p>Input your source material below</p>
          </div>
          <button class="dictate-btn" type="button">🎤 Dictate Notes</button>
        </div>

        <div class="notes-body">
          <textarea id="notesInput" placeholder="Paste complex topics, messy lecture notes, or textbook sections here..."></textarea>
          <div class="notes-meta">
            <span id="charCount">Character count: 0</span>
            <span>Formatting: Plain Text</span>
          </div>
          <div class="actions">
            <button class="action-btn" id="summaryBtn" type="button">Generate Summary</button>
            <button class="action-btn" id="flashcardBtn" type="button">Generate Flashcards</button>
            <button class="action-btn" id="focusBtn" type="button">Start Focus Session</button>
          </div>
        </div>
      </section>

      <section class="results-grid">
        <article class="result-panel">
          <h3>Summary</h3>
          <div id="summaryBox" class="result-box">Your summary will appear here.</div>
        </article>
        <article class="result-panel">
          <h3>Flashcards</h3>
          <div id="flashcardBox" class="cards"></div>
        </article>
      </section>
    </main>
  </div>
  <script src="app.js" defer></script>
</body>
</html>
'@ | Set-Content -Path wwwroot/index.html -Encoding UTF8

@'
:root{
  --bg:#f6eefd;
  --surface:#fffdfd;
  --text:#4a1f66;
  --soft:#7f5aa0;
  --border:#6c2d87;
  --btn:#301934;
  --btnText:#f8ecff;
  --shadow:0 12px 30px rgba(108,45,135,.10);
}
html[data-theme="dark"]{
  --bg:#1d1423;
  --surface:#291d31;
  --text:#f6e8ff;
  --soft:#d6bce7;
  --border:#c08bdd;
  --btn:#c08bdd;
  --btnText:#24112e;
  --shadow:0 16px 34px rgba(0,0,0,.35);
}
*{box-sizing:border-box}
body{margin:0;min-height:100vh;background:var(--bg);color:var(--text);font-family:'Inter',sans-serif}
.page-shell{width:min(100%,980px);margin:0 auto;padding:12px 20px 28px}
.topbar{display:flex;justify-content:flex-end;margin-bottom:12px}
.theme-toggle,.dictate-btn,.action-btn{border:2px solid var(--border);border-radius:999px;background:var(--surface);color:var(--text);cursor:pointer}
.theme-toggle{min-height:56px;padding:0 28px;font-family:'Cormorant Garamond',serif;font-size:1.1rem;font-weight:700}
.app-wrap{display:flex;flex-direction:column;gap:26px}
.hero-title{margin:0;text-align:center;font-family:'Cormorant Garamond',serif;font-size:clamp(2.3rem,4vw,4.2rem);font-weight:700;line-height:1.05;white-space:nowrap}
.notes-card,.result-panel{background:var(--surface);border:2px solid var(--border);border-radius:14px;box-shadow:var(--shadow);overflow:hidden}
.notes-header{display:flex;justify-content:space-between;align-items:center;gap:20px;padding:24px 30px;border-bottom:2px solid var(--border)}
.notes-header h2,.result-panel h3{margin:0 0 6px;font-family:'Cormorant Garamond',serif}
.notes-header h2{font-size:clamp(1.7rem,2.4vw,2.3rem)}
.notes-header p,.notes-meta{color:var(--soft)}
.dictate-btn{min-height:56px;padding:0 28px;font-family:'Cormorant Garamond',serif;font-size:1rem;font-weight:700}
.notes-body{padding:30px}
textarea{width:100%;min-height:290px;padding:22px 20px;resize:vertical;border:2px solid var(--border);border-radius:14px;background:#fffefe;color:var(--text);outline:none;font-size:1.02rem;line-height:1.7}
textarea::placeholder{color:#9d72bf}
.notes-meta{display:flex;justify-content:space-between;gap:12px;margin:22px 8px 18px;font-size:.98rem}
.actions{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:16px}
.action-btn{min-height:64px;font-family:'Cormorant Garamond',serif;font-size:1.2rem;font-weight:700;background:var(--btn);color:var(--btnText)}
.results-grid{display:grid;grid-template-columns:1fr 1fr;gap:18px}
.result-panel{padding:22px}
.result-box{min-height:120px;white-space:pre-wrap}
.cards{display:grid;gap:12px}
.card-item{padding:14px;border:1px solid var(--border);border-radius:12px;background:color-mix(in srgb,var(--surface) 88%,var(--bg) 12%)}
@media (max-width:860px){.hero-title{white-space:normal}.results-grid{grid-template-columns:1fr}.actions{grid-template-columns:1fr}}
@media (max-width:720px){.page-shell{padding-inline:14px}.notes-header,.notes-body{padding:20px}.notes-header{flex-direction:column;align-items:stretch}.dictate-btn{width:100%}.notes-meta{flex-direction:column;align-items:flex-start;margin-inline:0}}
'@ | Set-Content -Path wwwroot/styles.css -Encoding UTF8

@'
const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const notesInput = document.getElementById('notesInput');
const charCount = document.getElementById('charCount');
const summaryBtn = document.getElementById('summaryBtn');
const flashcardBtn = document.getElementById('flashcardBtn');
const focusBtn = document.getElementById('focusBtn');
const summaryBox = document.getElementById('summaryBox');
const flashcardBox = document.getElementById('flashcardBox');

function setTheme(theme){
  root.setAttribute('data-theme', theme);
  themeToggle.textContent = theme === 'dark' ? '☀️ LIGHT MODE' : '🌙 DARK MODE';
}

themeToggle.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  setTheme(next);
});

notesInput.addEventListener('input', () => {
  charCount.textContent = `Character count: ${notesInput.value.length}`;
});

async function postJson(url, payload){
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return await res.json();
}

summaryBtn.addEventListener('click', async () => {
  const data = await postJson('/api/summary', { text: notesInput.value });
  summaryBox.textContent = data.summary || 'No summary returned.';
});

flashcardBtn.addEventListener('click', async () => {
  const data = await postJson('/api/flashcards', { text: notesInput.value });
  flashcardBox.innerHTML = '';
  (data.cards || []).forEach((c, i) => {
    const div = document.createElement('div');
    div.className = 'card-item';
    div.innerHTML = `<strong>${i + 1}. ${c.front}</strong><br><span>${c.back}</span>`;
    flashcardBox.appendChild(div);
  });
  if (!data.cards || data.cards.length === 0) flashcardBox.textContent = 'No flashcards generated.';
});

focusBtn.addEventListener('click', async () => {
  const data = await postJson('/api/focus-session', { minutes: 15 });
  alert(`Focus session started: ${data.minutes} minutes`);
});

setTheme('light');
'@ | Set-Content -Path wwwroot/app.js -Encoding UTF8

@'
<Project Sdk="Microsoft.NET.Sdk.Web">
  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
  </PropertyGroup>
</Project>
'@ | Set-Content -Path NeuroAssistantApp.csproj -Encoding UTF8

Write-Host "Project created in $root"