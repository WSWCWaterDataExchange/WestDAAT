using WesternStatesWater.WestDaat.Database.EntityFramework;

namespace WesternStatesWater.WestDaat.Tests.Helpers
{
    public sealed class StateFaker : ControlledVocabularyFakerBase<State>
    {
        public StateFaker()
        {
            RuleFor(a => a.Name, b => b.Address.StateAbbr())
                .RuleFor(a => a.Term, (_, o) => o.Name)
                .RuleFor(a => a.Definition, b => b.Random.String(10, 'A', 'z'))
                .RuleFor(a => a.State, (_, o) => o.Name)
                .RuleFor(a => a.WaDEName, () => "");
        }
    }
}