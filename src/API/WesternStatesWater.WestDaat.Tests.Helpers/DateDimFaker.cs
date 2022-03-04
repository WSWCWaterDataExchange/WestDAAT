using WesternStatesWater.WestDaat.Accessors.EntityFramework;

namespace WesternStatesWater.WestDaat.Tests.Helpers
{
    internal class DateDimFaker : Faker<DateDim>
    {
        public DateDimFaker()
        {
            this.RuleFor(a => a.Date, b => b.Date.Past(100).Date)
                .RuleFor(a => a.Year, b => b.Date.Past(100).Year.ToString());
        }
    }
}