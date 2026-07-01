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
