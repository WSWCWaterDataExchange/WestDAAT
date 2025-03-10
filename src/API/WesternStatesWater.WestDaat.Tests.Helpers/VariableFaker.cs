using WesternStatesWater.WaDE.Database.EntityFramework;

namespace WesternStatesWater.WestDaat.Tests.Helpers
{
    internal class VariableFaker : Faker<Variable>
    {
        public VariableFaker()
        {
            this.RuleFor(a => a.Name, b => b.Random.String(10, 'A', 'z'))
                .RuleFor(a => a.Term, b => b.Random.String(10, 'A', 'z'));
        }
    }
}