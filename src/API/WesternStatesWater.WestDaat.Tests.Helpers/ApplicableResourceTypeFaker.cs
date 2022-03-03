using Bogus;
using WesternStatesWater.WestDaat.Accessors.EntityFramework;

namespace WesternStatesWater.WestDaat.Tests.Helpers
{
    internal class ApplicableResourceTypeFaker : Faker<ApplicableResourceType>
    {
        public ApplicableResourceTypeFaker()
        {
            this.RuleFor(a => a.Name, b => b.Random.String(10));
        }
    }
}