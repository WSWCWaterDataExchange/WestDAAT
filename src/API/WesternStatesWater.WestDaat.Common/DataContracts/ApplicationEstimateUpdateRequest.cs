namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class ApplicationEstimateUpdateRequest : ApplicationStoreRequestBase
{
    required public Guid WaterConservationApplicationId { get; set; }

    required public int EstimatedCompensationDollars { get; set; }

    required public double CumulativeTotalEtInAcreFeet { get; set; }

    required public double? CumulativeNetEtInAcreFeet { get; set; } = null!;

    required public ApplicationEstimateUpdateLocationDetails[] Locations { get; set; }

    required public ApplicationEstimateStoreControlLocationDetails ControlLocation { get; set; } = null!;
}
