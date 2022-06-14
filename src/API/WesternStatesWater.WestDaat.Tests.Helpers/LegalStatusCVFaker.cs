using WesternStatesWater.WestDaat.Accessors.EntityFramework;

namespace WesternStatesWater.WestDaat.Tests.Helpers
{
    public class LegalStatusCVFaker : Faker<LegalStatus>
    {
        public LegalStatusCVFaker()
        {
            this.RuleFor(a => a.Name, b => b.Random.String(10, 'A', 'z'))
                .RuleFor(a => a.Term, b => b.Random.String(10, 'A', 'z'))
                .RuleFor(a => a.Definition, b => b.Lorem.Slug(10))
                .RuleFor(a => a.State, b => b.Address.StateAbbr())
                .RuleFor(a => a.WaDEName, b => b.Random.String(10, 'A', 'z'));
        }
    }
}