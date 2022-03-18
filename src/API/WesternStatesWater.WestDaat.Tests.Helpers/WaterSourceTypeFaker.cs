using WesternStatesWater.WestDaat.Accessors.EntityFramework;

namespace WesternStatesWater.WestDaat.Tests.Helpers
{
    public class WaterSourceTypeFaker : Faker<WaterSourceType>
    {
        public WaterSourceTypeFaker()
        {
            this.RuleFor(x => x.Name, b => b.Random.String(10, 'A', 'z'))
                .RuleFor(x => x.Term, b => b.Random.String(10, 'A', 'z'));
        }
    }
}
