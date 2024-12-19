using WesternStatesWater.WestDaat.Database.EntityFramework;

namespace WesternStatesWater.WestDaat.Tests.Helpers;

public class ReportingUnitsFactFaker : Faker<RegulatoryReportingUnitsFact>
{
    public ReportingUnitsFactFaker()
    {
        RuleFor(r => r.Organization, new OrganizationsDimFaker().Generate());
        RuleFor(r => r.DataPublicationDate, new DateDimFaker().Generate());
    }
}