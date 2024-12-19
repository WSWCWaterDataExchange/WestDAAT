using WesternStatesWater.WestDaat.Database.EntityFramework;

namespace WesternStatesWater.WestDaat.Tests.Helpers
{
    public class WaterQualityIndicatorFaker : Faker<WaterQualityIndicator>
    {
        public WaterQualityIndicatorFaker()
        {
            this.RuleFor(x => x.Name, b => b.Random.String(10, 'A', 'z'))
                .RuleFor(x => x.Term, b => b.Random.String(10, 'A', 'z'));
        }
    }
}
