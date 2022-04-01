using System.Diagnostics.CodeAnalysis;
using WesternStatesWater.WestDaat.Accessors.EntityFramework;

namespace WesternStatesWater.WestDaat.Tests.Helpers
{
    public class AllocationAmountFactFaker : Faker<AllocationAmountsFact>
    {
        public AllocationAmountFactFaker()
        {
            this.RuleFor(a => a.Organization, b => new OrganizationsDimFaker().Generate())
                .RuleFor(a => a.DataPublicationDate, b => new DateDimFaker().Generate())
                .RuleFor(a => a.Method, b => new MethodsDimFaker().Generate())
                .RuleFor(a => a.VariableSpecific, b => new VariablesDimFaker().Generate());
        }
    }

    [SuppressMessage("StyleCop.CSharp.OrderingRules", "SA1204:StaticElementsMustAppearBeforeInstanceElements", Justification = "Extension methods after class.")]
    public static class AllocationAmountFactFakerExtensions
    {
        public static Faker<AllocationAmountsFact> SetAllocationPriorityDate(this Faker<AllocationAmountsFact> faker, DateTime? dateValue)
        {
            DateDim date = null;
            if (dateValue != null)
            {
                date = new DateDimFaker()
                    .RuleFor(a => a.Date, () => dateValue)
                    .Generate();
            }
            faker.RuleFor(a => a.AllocationPriorityDateID, () => null)
                .RuleFor(a => a.AllocationPriorityDateNavigation, () => date);
            return faker;
        }

        public static Faker<AllocationAmountsFact> SetAllocationExpirationDate(this Faker<AllocationAmountsFact> faker, DateTime? dateValue)
        {
            DateDim date = null;
            if (dateValue != null)
            {
                date = new DateDimFaker()
                    .RuleFor(a => a.Date, () => dateValue)
                    .Generate();
            }
            faker.RuleFor(a => a.AllocationExpirationDateID, () => null)
                .RuleFor(a => a.AllocationExpirationDateNavigation, () => date);
            return faker;
        }

        public static Faker<AllocationAmountsFact> LinkSites(this Faker<AllocationAmountsFact> faker, params SitesDim[] sites)
        {
            faker.RuleFor(a => a.AllocationBridgeSitesFact, () => sites.Select(c => new AllocationBridgeSiteFactFaker().RuleFor(a => a.Site, () => c).Generate()).ToList());
            return faker;
        }

        public static Faker<AllocationAmountsFact> LinkBeneficialUses(this Faker<AllocationAmountsFact> faker, params BeneficialUsesCV[] beneficialUses)
        {
            faker.RuleFor(a => a.AllocationBridgeBeneficialUsesFact, () => beneficialUses.Select(c => new AllocationBridgeBeneficialUsesFactFaker().RuleFor(a => a.BeneficialUse, () => c).Generate()).ToList());
            return faker;
        }
    }
}