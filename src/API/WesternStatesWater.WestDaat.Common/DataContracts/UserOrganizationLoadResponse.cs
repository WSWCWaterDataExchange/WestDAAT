namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class UserOrganizationLoadResponse : OrganizationLoadResponseBase
{
    public OrganizationSummaryItem[] Organizations { get; set; }
}