using System.Text.Json.Serialization;
using WesternStatesWater.Shared.Errors;

namespace WesternStatesWater.Shared.DataContracts;

public class ResponseBase
{
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public ErrorBase? Error { get; set; }
}