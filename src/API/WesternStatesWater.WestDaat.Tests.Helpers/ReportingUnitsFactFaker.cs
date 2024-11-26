using WesternStatesWater.WestDaat.Accessors.EntityFramework;

namespace WesternStatesWater.WestDaat.Tests.Helpers;

public class ReportingUnitsFactFaker : Faker<RegulatoryReportingUnitsFact>
{
    public ReportingUnitsFactFaker()
    {
        RuleFor(r => r.Organization, new OrganizationsDimFaker().Generate());
        // RuleFor(r => r.ReportingUnit, new ReportingUnitsDimFaker().Generate());
        // RuleFor(r => r.RegulatoryOverlay, new OverlayDimFaker().Generate());
        RuleFor(r => r.DataPublicationDate, new DateDimFaker().Generate());
    }
}