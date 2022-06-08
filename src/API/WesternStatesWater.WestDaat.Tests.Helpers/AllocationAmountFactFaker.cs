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
                .RuleFor(a => a.VariableSpecific, b => new VariablesDimFaker().Generate())
                .RuleFor(a => a.AllocationNativeId, f => f.Random.String(11, 'A', 'z'));
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

        public static Faker<AllocationAmountsFact> SetAllocationPriorityDate(this Faker<AllocationAmountsFact> faker, Func<DateTime?> dateGenerator)
        {
            var dateFaker = new DateDimFaker()
                    .RuleFor(a => a.Date, dateGenerator);

            faker.RuleFor(a => a.AllocationPriorityDateID, () => null)
                .RuleFor(a => a.AllocationPriorityDateNavigation, () => dateFaker.Generate());

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

        public static Faker<AllocationAmountsFact> SetExemptOfVolumeFlowPriority(this Faker<AllocationAmountsFact> faker, bool? isExempt)
        {
            if (isExempt != null)
            {
                faker
                    .RuleFor(a => a.ExemptOfVolumeFlowPriority, () => isExempt);
            }
            else
            {
                faker.RuleFor(a => a.ExemptOfVolumeFlowPriority, () => null);
            }
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

        public static Faker<AllocationAmountsFact> LinkOrganizaion(this Faker<AllocationAmountsFact> faker, OrganizationsDim organization)
        {
            faker.RuleFor(a => a.OrganizationId, () => organization.OrganizationId)
                .RuleFor(a => a.Organization, () => organization);
            return faker;
        }

        public static Faker<AllocationAmountsFact> IncludeOwnerClassification(this Faker<AllocationAmountsFact> faker)
        {
            faker.RuleFor(a => a.OwnerClassificationCV, b => b.Random.String(10, 'A', 'z'))
                .RuleFor(a => a.OwnerClassification,
                    (faker, allocationAmountFact) => new OwnerClassificationCvFaker()
                        .RuleFor(ownerClassificationCv => ownerClassificationCv.Name, f => allocationAmountFact.OwnerClassificationCV));

            return faker;
        }

        public static Faker<AllocationAmountsFact> IncludeLegalStatus(this Faker<AllocationAmountsFact> faker)
        {
            faker.RuleFor(a => a.AllocationLegalStatusCv, b => b.Random.String(10, 'A', 'z'))
                .RuleFor(a => a.AllocationLegalStatusCvNavigation,
                    (faker, allocationAmountFact) => new LegalStatusCVFaker()
                        .RuleFor(legalStatusCV => legalStatusCV.Name, f => allocationAmountFact.AllocationLegalStatusCv));

            return faker;
        }
    }
}