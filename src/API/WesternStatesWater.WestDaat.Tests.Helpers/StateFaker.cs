using WesternStatesWater.WestDaat.Accessors.EntityFramework;

namespace WesternStatesWater.WestDaat.Tests.Helpers
{
    public class StateFaker : Faker<State>
    {
        public StateFaker()
        {
            this.RuleFor(a => a.Name, b => b.Address.StateAbbr())
                .RuleFor(a => a.Term, (b, o) => o.Name)
                .RuleFor(a => a.Definition, b => b.Random.String(10, 'A', 'z'))
                .RuleFor(a => a.StateAbbr, (b, o) => o.Name)
                .RuleFor(a => a.WaDEName, () => "");
        }
    }
}