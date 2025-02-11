namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class UserOrganizationLoadResponse : OrganizationLoadResponseBase
{
    public OrganizationSlim[] Organizations { get; set; }
}