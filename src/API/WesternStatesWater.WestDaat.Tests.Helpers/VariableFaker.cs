using Bogus;
using WesternStatesWater.WestDaat.Accessors.EntityFramework;

namespace WesternStatesWater.WestDaat.Tests.Helpers
{
    internal class VariableFaker : Faker<Variable>
    {
        public VariableFaker()
        {
            this.RuleFor(a => a.Name, b => b.Random.String(10))
                .RuleFor(a => a.Term, b => b.Random.String(10));
        }
    }
}