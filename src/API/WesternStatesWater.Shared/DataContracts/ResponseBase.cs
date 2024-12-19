using WesternStatesWater.Shared.Errors;

namespace WesternStatesWater.Shared.DataContracts;

public class ResponseBase
{
    public ErrorBase? Error { get; set; }
}