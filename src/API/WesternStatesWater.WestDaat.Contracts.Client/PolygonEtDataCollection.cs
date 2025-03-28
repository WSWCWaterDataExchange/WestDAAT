﻿namespace WesternStatesWater.WestDaat.Contracts.Client;

public class PolygonEtDataCollection
{
    public Guid WaterConservationApplicationEstimateLocationId { get; set; }

    public string PolygonWkt { get; set; }

    public Common.DataContracts.DrawToolType DrawToolType { get; set; }

    public double AverageYearlyEtInInches { get; set; }

    public double AverageYearlyEtInAcreFeet { get; set; }

    public PolygonEtDatapoint[] Datapoints { get; set; }
}
