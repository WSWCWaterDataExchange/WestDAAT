namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class ApplicationEstimateStoreLocationConsumptiveUseDetails
{
    required public int Year { get; set; }

    required public double TotalEtInInches { get; set; }

    required public double? EffectivePrecipitationInInches { get; set; } = null!;

    required public double? NetEtInInches { get; set; } = null!;
}
