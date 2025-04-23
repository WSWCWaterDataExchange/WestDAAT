using WesternStatesWater.WaDE.Database.EntityFramework;

namespace WesternStatesWater.WestDaat.Tests.Helpers;

public class OverlayDimFaker : Faker<OverlayDim>
{
    public OverlayDimFaker()
    {
        RuleFor(r=>r.OverlayUuid, f=>f.Random.Uuid().ToString());
        RuleFor(r => r.OverlayName, f => f.Random.Word());
        RuleFor(r => r.OversightAgency, f => f.Company.CompanyName());
        RuleFor(r => r.OverlayDescription, f => f.Lorem.Sentence());
    }
}