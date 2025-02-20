namespace WesternStatesWater.WestDaat.Contracts.Client;

public class OrganizationFundingDetails
{
    public Guid OrganizationId { get; set; }

    public string OrganizationName { get; set; }

    public string OpenEtModelDisplayName { get; set; }

    public DateOnly OpenEtDateRangeStart { get; set; }

    public DateOnly OpenEtDateRangeEnd { get; set; }

    public string CompensationRateModel { get; set; }
}
