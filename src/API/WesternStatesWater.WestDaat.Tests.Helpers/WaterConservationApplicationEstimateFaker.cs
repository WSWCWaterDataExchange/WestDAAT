using WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Tests.Helpers;

public class WaterConservationApplicationEstimateFaker : Faker<EFWD.WaterConservationApplicationEstimate>
{
    public WaterConservationApplicationEstimateFaker(EFWD.WaterConservationApplication application = null)
    {
        RuleFor(wcas => wcas.Model, f => f.PickRandomWithout(RasterTimeSeriesModel.None));

        // 6 to 1 years ago
        RuleFor(wcas => wcas.DateRangeStart, f => DateOnly.FromDateTime(f.Date.Past(5, DateTime.Now.AddYears(-1))));

        // current year
        RuleFor(wcas => wcas.DateRangeStart, f => DateOnly.FromDateTime(DateTime.Now));

        RuleFor(wcas => wcas.CompensationRateDollars, f => f.Random.Int(100, 1000));

        RuleFor(wcas => wcas.CompensationRateUnits, f => f.PickRandomWithout(CompensationRateUnits.None));

        RuleFor(wcas => wcas.EstimatedCompensationDollars, f => f.Random.Int(100, 1000));

        RuleFor(wcae => wcae.CumulativeTotalEtInAcreFeet, f => f.Random.Int(10, 1000));

        // net et should be smaller than total et, but shouldn't be negative
        RuleFor(wcae => wcae.CumulativeNetEtInAcreFeet, (f, estimate) => Math.Max(estimate.CumulativeTotalEtInAcreFeet - f.Random.Int(10, 1000), 5));

        if (application != null)
        {
            RuleFor(wcae => wcae.WaterConservationApplication, () => application);
        }
    }
}

public static class WaterConservationApplicationEstimateFakerExtensions
{
    public static Faker<EFWD.WaterConservationApplicationEstimate> GenerateMetadataFromOrganization(
        this Faker<EFWD.WaterConservationApplicationEstimate> faker,
        EFWD.Organization organization
    )
    {
        faker.RuleFor(est => est.Model, () => organization.OpenEtModel);

        faker.RuleFor(est => est.DateRangeStart, () =>
            DateOnly.FromDateTime(
                new DateTimeOffset(DateTimeOffset.UtcNow.Year - organization.OpenEtDateRangeInYears, 1, 1, 0, 0, 0, TimeSpan.Zero)
                .UtcDateTime
            )
        );

        faker.RuleFor(est => est.DateRangeEnd, () =>
            DateOnly.FromDateTime(
                new DateTimeOffset(DateTimeOffset.UtcNow.Year, 1, 1, 0, 0, 0, TimeSpan.Zero)
                .AddMinutes(-1)
                .UtcDateTime
            )
        );

        return faker;
    }
}