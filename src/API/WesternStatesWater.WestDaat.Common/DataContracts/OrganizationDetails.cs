namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class OrganizationDetails
{
    public Guid OrganizationId { get; set; }

    public string Name { get; set; }

    public int UserCount { get; set; }

    public string EmailDomain { get; set; }

    public string AgencyId { get; set; }
}
