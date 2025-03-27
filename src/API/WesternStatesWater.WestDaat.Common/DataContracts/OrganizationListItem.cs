namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class OrganizationListItem
{
    public Guid OrganizationId { get; set; }

    public string Name { get; set; }

    public int UserCount { get; set; }
    
    public string EmailDomain { get; set; }
}