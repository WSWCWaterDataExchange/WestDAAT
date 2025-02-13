namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class OrganizationListSummaryResponse : OrganizationLoadResponseBase
{
    public List<OrganizationSummaryItem> Organizations { get; set; }
}