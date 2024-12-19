namespace WesternStatesWater.Shared.Errors;

public abstract record ErrorBase
{
    public string? PublicMessage { get; init; }
}