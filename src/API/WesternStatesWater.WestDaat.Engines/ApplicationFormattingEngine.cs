using System.Text;
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

    /// <summary>
    /// Sets the display Id field in the following format.
    /// <code>{Year}-{AgencyIdentifier}-{SequentialNumber}</code> 
    /// * Year is the current year.<br />
    /// * AgencyIdentifier is the AgencyId field of the corresponding Organization.<br />
    /// * SequentialNumber is the nth Application created in the current year for this Organization.
    /// </summary>
    /// <param name="request"></param>
    /// <returns></returns>
    private Task FormatWaterConservationApplicationCreateRequest(WaterConservationApplicationCreateRequest request)
    {
        var displayIdFormattedString = new StringBuilder();

        displayIdFormattedString.Append(DateTimeOffset.UtcNow.Year.ToString());
        displayIdFormattedString.Append("-");



        request.ApplicationDisplayId = displayIdFormattedString.ToString();
    }
}