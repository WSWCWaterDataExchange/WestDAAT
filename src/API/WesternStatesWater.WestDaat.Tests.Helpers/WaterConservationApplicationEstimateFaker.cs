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

        RuleFor(wcas => wcas.TotalPolygonAreaAcres, f => f.Random.Double(10, 1000));

        RuleFor(wcas => wcas.TotalEtInches, f => f.Random.Double(10, 1000));

        RuleFor(wcas => wcas.EstimatedCompensationDollars, f => f.Random.Int(100, 1000));

        if (application != null)
        {
            RuleFor(wcae => wcae.WaterConservationApplication, () => application);
        }
    }
}
