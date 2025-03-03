namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class WaterConservationApplicationCreateResponse : ApplicationStoreResponseBase
{
    public Guid WaterConservationApplicationId { get; set; }

    public string WaterConservationApplicationDisplayId { get; set; }
}
