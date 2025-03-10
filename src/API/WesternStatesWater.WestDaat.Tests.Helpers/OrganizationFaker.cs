using WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Tests.Helpers;

public class OrganizationFaker : Faker<EFWD.Organization>
{
    public OrganizationFaker()
    {
        RuleFor(o => o.Name, f => f.Company.CompanyName());
        RuleFor(o => o.EmailDomain, f => f.Person.Email.Split('@')[1]);
        RuleFor(o => o.AbbreviatedName, f => f.Company.CompanySuffix());
        RuleFor(o => o.OpenEtModel, f => f.PickRandomWithout(RasterTimeSeriesModel.None));
        RuleFor(o => o.OpenEtDateRangeInYears, f => f.Random.Int(1, 10));
        RuleFor(o => o.OpenEtCompensationRateModel, f => f.Lorem.Paragraph());
    }
}
