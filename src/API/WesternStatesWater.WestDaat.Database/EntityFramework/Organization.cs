using WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Database.EntityFramework;

public class Organization
{
    public Organization()
    {
        UserOrganizations = new HashSet<UserOrganization>();
    }

    public Guid Id { get; set; }

    public string Name { get; set; } = null!;

    public string EmailDomain { get; set; } = null!;

    public string AbbreviatedName { get; set; } = null!;

    public RasterTimeSeriesModel OpenEtModel { get; set; }

    public int OpenEtDateRangeInYears { get; set; }

    public string OpenEtCompensationRateModel { get; set; }

    public virtual ICollection<UserOrganization> UserOrganizations { get; set; }
}