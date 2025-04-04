﻿namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class EstimateDetails
{
    public Guid Id { get; set; }

    public int CompensationRateDollars { get; set; }

    public CompensationRateUnits CompensationRateUnits { get; set; }

    public int EstimatedCompensationDollars { get; set; }

    public double CumulativeTotalEtInAcreFeet { get; set; }

    public LocationDetails[] Locations { get; set; } = null!;
}
