namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class CalculateTotalAverageEvapotranspirationRequest
{
    public EvapotranspirationAggregateDetails[] Details { get; set; }

    public DesiredCompensationUnits DesiredCompensationUnits { get; set; }
}
