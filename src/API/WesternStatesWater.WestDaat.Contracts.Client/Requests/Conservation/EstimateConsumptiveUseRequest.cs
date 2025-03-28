using WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;

public class EstimateConsumptiveUseRequest : ApplicationStoreRequestBase
{
    public Guid WaterConservationApplicationId { get; set; }

    public string WaterRightNativeId { get; set; } = null!;

    public MapPolygon[] Polygons { get; set; }

    public int? CompensationRateDollars { get; set; }

    public CompensationRateUnits? Units { get; set; }
}
