using Bogus;
using WesternStatesWater.WestDaat.Accessors.EntityFramework;

namespace WesternStatesWater.WestDaat.Tests.Helpers
{
    internal class MethodsDimFaker : Faker<MethodsDim>
    {
        public MethodsDimFaker()
        {
            var applicableResourceType = new ApplicableResourceTypeFaker().Generate();

            this.RuleFor(a => a.MethodUuid, b => b.Random.String(10, 'A', 'z'))
                .RuleFor(a => a.MethodName, b => b.Random.String(10, 'A', 'z'))
                .RuleFor(a => a.MethodDescription, b => b.Random.String(10, 'A', 'z'))
                .RuleFor(a => a.ApplicableResourceTypeCv, b => applicableResourceType.Name)
                .RuleFor(a => a.ApplicableResourceTypeCvNavigation, b => applicableResourceType)
                .RuleFor(a => a.MethodTypeCvNavigation, b => new MethodTypeFaker().Generate());
        }
    }
}