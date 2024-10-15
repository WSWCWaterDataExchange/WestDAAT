namespace WesternStatesWater.WestDaat.Client.Functions;

public record ValidationError
{
    public Dictionary<string, string[]> Errors { get; } = new();

    public ValidationError(string key, string[] values)
    {
        Errors[key] = values;
    }
}