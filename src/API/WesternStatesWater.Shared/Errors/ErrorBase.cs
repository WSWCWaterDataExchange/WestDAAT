using System.Text.Json.Serialization;

namespace WesternStatesWater.Shared.Errors;

public abstract record ErrorBase
{
    [JsonIgnore]
    public string LogMessage { get; init; } = null!;

    public string? PublicMessage { get; init; }
}