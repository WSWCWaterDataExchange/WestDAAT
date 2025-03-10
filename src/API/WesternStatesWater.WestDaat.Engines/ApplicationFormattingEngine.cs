using WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Engines;

public sealed partial class FormattingEngine : IApplicationFormattingEngine
{
    public async Task<ApplicationFormatResponseBase> Format(ApplicationFormatRequestBase request)
    {
        return request switch
        {
            ApplicationFormatDisplayIdRequest req => await FormatDisplayId(req),
            _ => throw new NotImplementedException(),
        };
    }

    private async Task<ApplicationFormatDisplayIdResponse> FormatDisplayId(ApplicationFormatDisplayIdRequest request)
    {
        var year = DateTimeOffset.UtcNow.Year.ToString();

        var organizationDetailsRequest = new OrganizationLoadDetailsRequest
        {
            OrganizationId = request.FundingOrganizationId,
        };
        var organizationDetailsResponse = (OrganizationLoadDetailsResponse)await _organizationAccessor.Load(organizationDetailsRequest);

        var sequentialLookupRequest = new ApplicationFindSequentialIdLoadRequest
        {
            ApplicationDisplayIdStub = $"{year}-{organizationDetailsResponse.Organization.AbbreviatedName}-",
        };
        var sequentialLookupResponse = (ApplicationFindSequentialIdLoadResponse)await _applicationAccessor.Load(sequentialLookupRequest);

        var nextSequentialNumber = sequentialLookupResponse.LastDisplayIdSequentialNumber + 1;
        var paddedNextSequentialNumber = $"{nextSequentialNumber:D4}";

        return new ApplicationFormatDisplayIdResponse
        {
            DisplayId = $"{year}-{organizationDetailsResponse.Organization.AbbreviatedName}-{paddedNextSequentialNumber}",
        };
    }
}

