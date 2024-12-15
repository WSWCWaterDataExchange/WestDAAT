using WesternStatesWater.WestDaat.Database.EntityFramework;

namespace WesternStatesWater.WestDaat.Tests.Helpers
{
    public sealed class DateDimFaker : Faker<DateDim>
    {
        // avoid duplicate dates
        private static DateTime _date = new(1900, 1, 1);

        public DateDimFaker()
        {
            RuleFor(a => a.Date, NextDate)
                .RuleFor(a => a.Year, (_, o) => o.Date.Year.ToString());
        }

        private static DateTime NextDate()
        {
            _date = _date.AddDays(1);
            return _date;
        }
    }
}