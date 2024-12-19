using WesternStatesWater.WestDaat.Database.EntityFramework;
using WesternStatesWater.WestDaat.Tests.Helpers.Geometry;

namespace WesternStatesWater.WestDaat.Tests.Helpers;

public class ReportingUnitDimFaker : Faker<ReportingUnitsDim>
{
    public ReportingUnitDimFaker()
    {
        RuleFor(r => r.ReportingUnitUuid, f => f.Random.Uuid().ToString());
        RuleFor(r => r.ReportingUnitNativeId, f => f.Random.Uuid().ToString());
        RuleFor(r => r.ReportingUnitName, f => f.Random.Word());
        RuleFor(r => r.ReportingUnitTypeCv, new ReportingUnitTypeCVFaker().Generate().Name);
        RuleFor(r => r.ReportingUnitUpdateDate, f => f.Date.Past());
        RuleFor(r => r.ReportingUnitProductVersion, (string) null);
        RuleFor(r => r.StateCv, f => new StateFaker().Generate().Name);
        RuleFor(a => a.EpsgcodeCvNavigation, new EpsgcodeFaker().Generate());
        RuleFor(r => r.Geometry, new PolygonFaker().Generate());
    }
}