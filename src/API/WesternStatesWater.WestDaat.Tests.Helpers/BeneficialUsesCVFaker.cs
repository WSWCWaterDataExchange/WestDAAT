using WesternStatesWater.WaDE.Database.EntityFramework;

namespace WesternStatesWater.WestDaat.Tests.Helpers
{
    public class BeneficialUsesCVFaker : ControlledVocabularyFakerBase<BeneficialUsesCV>
    {
        public BeneficialUsesCVFaker()
        {
            RuleFor(a => a.ConsumptionCategoryType, Common.ConsumptionCategory.NonConsumptive);
        }
    }
}