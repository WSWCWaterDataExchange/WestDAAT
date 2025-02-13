namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class OrganizationListDetailsResponse : OrganizationLoadResponseBase
{
    public OrganizationListItem[] Organizations { get; set; }
}