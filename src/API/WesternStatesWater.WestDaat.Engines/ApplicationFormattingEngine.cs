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
    /// * SequentialNumber is the nth Application created in the current year for this Organization, left-padded to display 4 digits.
    /// </summary>
    /// <param name="request"></param>
    /// <returns></returns>
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