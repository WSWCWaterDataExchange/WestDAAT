using WesternStatesWater.WaDE.Database.EntityFramework;

namespace WesternStatesWater.WestDaat.Tests.Helpers
{
    internal class ApplicableResourceTypeFaker : Faker<ApplicableResourceType>
    {
        public ApplicableResourceTypeFaker()
        {
            this.RuleFor(a => a.Name, b => b.Random.String(10, 'A', 'z'));
        }
    }
}