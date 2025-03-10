namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class OrganizationDetailsListResponse : OrganizationLoadResponseBase
{
    public OrganizationListItem[] Organizations { get; set; }
}