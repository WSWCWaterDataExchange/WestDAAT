using WesternStatesWater.WestDaat.Accessors.EntityFramework;

namespace WesternStatesWater.WestDaat.Tests.Helpers
{
    internal class MethodTypeFaker : Faker<MethodType>
    {
        public MethodTypeFaker()
        {
            this.RuleFor(a => a.Term, b => b.Random.String(10, 'A', 'z'))
                .RuleFor(a => a.Name, b => b.Random.String(10, 'A', 'z'));
        }
    }
}