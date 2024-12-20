namespace WesternStatesWater.Shared.Errors;

public record ValidationError : ErrorBase
{
    public IDictionary<string, string[]> Errors { get; }

    public ValidationError(IDictionary<string, string[]> errors)
    {
        Errors = errors;
    }

    public ValidationError(string key, string[] values)
    {
        Errors = new Dictionary<string, string[]>
        {
            [key] = values
        };
    }
}