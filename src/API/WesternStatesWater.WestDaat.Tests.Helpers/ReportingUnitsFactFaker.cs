using WesternStatesWater.WaDE.Database.EntityFramework;

namespace WesternStatesWater.WestDaat.Tests.Helpers;

public class ReportingUnitsFactFaker : Faker<OverlayReportingUnitsFact>
{
    public ReportingUnitsFactFaker()
    {
        RuleFor(r => r.Organization, new OrganizationsDimFaker().Generate());
        RuleFor(r => r.DataPublicationDate, new DateDimFaker().Generate());
    }
}