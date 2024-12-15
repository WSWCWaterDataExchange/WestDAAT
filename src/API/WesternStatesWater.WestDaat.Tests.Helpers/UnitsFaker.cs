using WesternStatesWater.WestDaat.Database.EntityFramework;

namespace WesternStatesWater.WestDaat.Tests.Helpers
{
    internal class UnitsFaker : Faker<Units>
    {
        public UnitsFaker()
        {
            this.RuleFor(a => a.Name, b => b.Random.String(10, 'A', 'z'))
                .RuleFor(a => a.Term, b => b.Random.String(10, 'A', 'z'));
        }
    }
}