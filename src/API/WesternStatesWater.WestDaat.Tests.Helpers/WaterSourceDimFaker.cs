using WesternStatesWater.WaDE.Database.EntityFramework;

namespace WesternStatesWater.WestDaat.Tests.Helpers
{
    public class WaterSourceDimFaker : Faker<WaterSourcesDim>
    {
        public WaterSourceDimFaker()
        {
            this.RuleFor(a => a.WaterSourceUuid, b => b.Random.String(11, 'A', 'z'))
                .RuleFor(a => a.WaterSourceName, b => b.Random.String(11, 'A', 'z'))
                .RuleFor(a => a.WaterSourceNativeId, b => b.Random.String(11, 'A', 'z'))
                .RuleFor(a => a.WaterSourceTypeCvNavigation, b => new WaterSourceTypeFaker().Generate())
                .RuleFor(a => a.WaterQualityIndicatorCvNavigation, b => new WaterQualityIndicatorFaker().Generate());
        }
    }
}
