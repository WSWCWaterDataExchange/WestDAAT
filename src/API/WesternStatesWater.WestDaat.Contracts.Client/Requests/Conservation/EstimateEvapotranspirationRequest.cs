using WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;

public class EstimateEvapotranspirationRequest : ApplicationLoadRequestBase
{
    public Guid FundingOrganizationId { get; set; }

    public string[] Polygons { get; set; } // WKT format

    public RasterTimeSeriesModel Model { get; set; }

    public DateOnly DateRangeStart { get; set; } // inclusive

    public DateOnly DateRangeEnd { get; set; } // inclusive

    public int? DesiredCompensation { get; set; } // dollar amount

    public DesiredCompensationUnits? Units { get; set; } // acre, acre-ft
}
