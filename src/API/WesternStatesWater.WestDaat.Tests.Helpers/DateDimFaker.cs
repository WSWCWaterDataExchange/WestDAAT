using WesternStatesWater.WestDaat.Accessors.EntityFramework;

namespace WesternStatesWater.WestDaat.Tests.Helpers
{
    public class DateDimFaker : Faker<DateDim>
    {
        private List<DateOnly> _uniqueDates = new List<DateOnly>(); //use this to prevent collisions in the Date_Dim table

        public DateDimFaker()
        {
            this.RuleFor(a => a.Date, GenerateDate)
                .RuleFor(a => a.Year, (b, o) => o.Date.Year.ToString());
        }

        public DateTime GenerateDate(Faker faker)
        {
            var generatedDate = faker.Date.Past(100).Date;
            while (_uniqueDates.Contains(DateOnly.FromDateTime(generatedDate))) 
            {
                generatedDate = faker.Date.Past(100).Date;
            }
            _uniqueDates.Add(DateOnly.FromDateTime(generatedDate));
            return generatedDate;
        }
    }
}