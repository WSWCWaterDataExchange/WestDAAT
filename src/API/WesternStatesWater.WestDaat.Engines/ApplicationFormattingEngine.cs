using WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Engines;

public sealed partial class FormattingEngine : IApplicationFormattingEngine
{
    public async Task FormatStoreRequest(ApplicationStoreRequestBase request)
    {
        switch (request)
        {
            case WaterConservationApplicationCreateRequest req:
                await FormatWaterConservationApplicationCreateRequest(req);
                break;
            default:
                throw new NotImplementedException();
        }
    }

    private Task FormatWaterConservationApplicationCreateRequest(WaterConservationApplicationCreateRequest request)
    {
        return Task.CompletedTask;
    }
}