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
    /// Generates a user-friendly id to be displayed on the frontend.
    /// </summary>
    private async Task FormatWaterConservationApplicationCreateRequest(WaterConservationApplicationCreateRequest request)
    {
        var displayIdFormattedString = new StringBuilder();

        displayIdFormattedString.Append(DateTimeOffset.UtcNow.Year.ToString());
        displayIdFormattedString.Append("-");

        var organizationDetailsRequest = new OrganizationLoadDetailsRequest
        {
            OrganizationId = request.FundingOrganizationId,
        };
        var organizationDetailsResponse = (OrganizationLoadDetailsResponse)await _organizationAccessor.Load(organizationDetailsRequest);

        displayIdFormattedString.Append(organizationDetailsResponse.Organization.AbbreviatedName);
        displayIdFormattedString.Append("-");

        var sequentialLookupRequest = new ApplicationFindSequentialIdLoadRequest
        {
            ApplicationDisplayIdStub = displayIdFormattedString.ToString(),
        };
        var sequentialLookupResponse = (ApplicationFindSequentialIdLoadResponse)await _applicationAccessor.Load(sequentialLookupRequest);

        var nextSequentialNumber = sequentialLookupResponse.LastDisplayIdSequentialNumber + 1;
        var paddedNextSequentialNumber = $"{nextSequentialNumber:D4}";
        displayIdFormattedString.Append(paddedNextSequentialNumber);

        request.ApplicationDisplayId = displayIdFormattedString.ToString();
    }
}