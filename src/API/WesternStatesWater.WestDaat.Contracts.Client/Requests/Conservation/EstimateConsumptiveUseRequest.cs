using WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;

public class EstimateConsumptiveUseRequest : ApplicationStoreRequestBase
{
    public Guid FundingOrganizationId { get; set; }

    public Guid? WaterConservationApplicationId { get; set; }

    public string[] Polygons { get; set; } // WKT format

    public RasterTimeSeriesModel Model { get; set; }

    public DateOnly DateRangeStart { get; set; } // inclusive

    public DateOnly DateRangeEnd { get; set; } // inclusive

    public int? CompensationRateDollars { get; set; } // dollar amount

    public CompensationRateUnits? Units { get; set; } // acre, acre-ft
}
