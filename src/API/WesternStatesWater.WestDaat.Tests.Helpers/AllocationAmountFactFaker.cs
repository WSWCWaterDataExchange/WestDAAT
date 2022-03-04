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
}