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
