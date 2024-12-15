using WesternStatesWater.WestDaat.Database.EntityFramework;

namespace WesternStatesWater.WestDaat.Tests.Helpers;

public class OverlayDimFaker : Faker<RegulatoryOverlayDim>
{
    public OverlayDimFaker()
    {
        RuleFor(r=>r.RegulatoryOverlayUuid, f=>f.Random.Uuid().ToString());
        RuleFor(r => r.RegulatoryName, f => f.Random.Word());
        RuleFor(r => r.OversightAgency, f => f.Company.CompanyName());
        RuleFor(r => r.RegulatoryDescription, f => f.Lorem.Sentence());
    }
}