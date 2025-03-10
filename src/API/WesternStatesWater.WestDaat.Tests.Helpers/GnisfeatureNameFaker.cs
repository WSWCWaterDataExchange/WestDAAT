using WesternStatesWater.WaDE.Database.EntityFramework;

namespace WesternStatesWater.WestDaat.Tests.Helpers
{
    internal class GnisfeatureNameFaker : Faker<GnisfeatureName>
    {
        public GnisfeatureNameFaker()
        {
            this.RuleFor(a => a.Name, b => b.Random.String(10, 'A', 'z'))
                .RuleFor(a => a.Term, b => b.Random.String(10, 'A', 'z'));
        }
    }
}