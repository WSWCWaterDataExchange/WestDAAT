namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class ConsumptiveUseDetails
{
    public Guid Id { get; set; }

    public int Year { get; set; }

    public double TotalEtInInches { get; set; }

    public double? EffectivePrecipitationInInches { get; set; } = null!;

    public double? NetEtInInches { get; set; } = null!;
}
