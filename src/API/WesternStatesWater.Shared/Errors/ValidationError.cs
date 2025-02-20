namespace WesternStatesWater.Shared.Errors;

public record ValidationError : ErrorBase
{
    public IDictionary<string, string[]> Errors { get; }

    public ValidationError(IDictionary<string, string[]> errors)
    {
        Errors = errors;
        LogMessage = $"Validation failed on the fields: {string.Join(", ", errors.Select(e => $"{e.Key}: [{string.Join(", ", e.Value)}]"))}";
    }
}