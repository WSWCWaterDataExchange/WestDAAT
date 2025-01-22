namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class OrganizationLoadAllResponse : OrganizationLoadResponseBase
{
    public List<OrganizationListDetails> Organizations { get; set; }
}
