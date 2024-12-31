using System.Text.Json.Serialization;

namespace WesternStatesWater.Shared.Errors;

public abstract record ErrorBase
{
    [JsonIgnore]
    public string? LogMessage { get; init; }

    public string? PublicMessage { get; init; }
}