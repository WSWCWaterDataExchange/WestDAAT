using WesternStatesWater.WestDaat.Accessors.EntityFramework;

namespace WesternStatesWater.WestDaat.Tests.Helpers;

public class SiteVariableAmountsFactFaker : Faker<SiteVariableAmountsFact>
{
    public SiteVariableAmountsFactFaker()
    {
        RuleFor(r => r.Organization, _ => new OrganizationsDimFaker().Generate());
        RuleFor(r => r.Site, _ => new SitesDimFaker().Generate());
        RuleFor(r => r.VariableSpecific, _ => new VariablesDimFaker().Generate());
        RuleFor(r => r.WaterSource, _ => new WaterSourceDimFaker().Generate());
        RuleFor(r => r.Method, _ => new MethodsDimFaker().Generate());
        RuleFor(r => r.TimeframeStartID, _ => new DateDimFaker().Generate().DateId);
        RuleFor(r => r.TimeframeEndID, _ => new DateDimFaker().Generate().DateId);
        RuleFor(r => r.DataPublicationDateID, _ => new DateDimFaker().Generate().DateId);
    }
}