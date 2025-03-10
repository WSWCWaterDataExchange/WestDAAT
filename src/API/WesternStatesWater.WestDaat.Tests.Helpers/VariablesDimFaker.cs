using WesternStatesWater.WaDE.Database.EntityFramework;

namespace WesternStatesWater.WestDaat.Tests.Helpers
{
    public class VariablesDimFaker : Faker<VariablesDim>
    {
        public VariablesDimFaker()
        {
            this.RuleFor(a => a.VariableSpecificCvNavigation, b => new VariableSpecificFaker().Generate())
                .RuleFor(a => a.VariableCvNavigation, b => new VariableFaker().Generate())
                .RuleFor(a => a.AggregationStatisticCvNavigation, b => new AggregationStatisticFaker().Generate())
                .RuleFor(a => a.AggregationIntervalUnitCvNavigation, b => new UnitsFaker().Generate())
                .RuleFor(a => a.ReportYearTypeCvNavigation, b => new ReportYearTypeFaker().Generate())
                .RuleFor(a => a.MaximumAmountUnitCvNavigation, b => new UnitsFaker().Generate())
                .RuleFor(a => a.AmountUnitCvNavigation, b => new UnitsFaker().Generate())
                .RuleFor(a => a.ReportYearStartMonth, b => b.Random.Number(1, 11).ToString())
                .RuleFor(a => a.VariableSpecificUuid, b => b.Random.String(10, 'A', 'z'));
        }
    }
}