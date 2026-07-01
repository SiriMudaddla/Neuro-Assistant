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
            cards.Add(new { front, back = sentence, hint = "Tap to reveal" });
        }

        return cards;
    }
}
