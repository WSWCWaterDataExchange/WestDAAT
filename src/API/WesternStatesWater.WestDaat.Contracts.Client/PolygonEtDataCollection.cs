﻿namespace WesternStatesWater.WestDaat.Contracts.Client;

public class PolygonEtDataCollection
{
    public Guid? WaterConservationApplicationEstimateLocationId { get; set; }

    public string PolygonWkt { get; set; }

    public Common.DataContracts.DrawToolType DrawToolType { get; set; }

    public double AverageYearlyTotalEtInInches { get; set; }

    public double AverageYearlyTotalEtInAcreFeet { get; set; }

    public double? AverageYearlyNetEtInInches { get; set; }

    public double? AverageYearlyNetEtInAcreFeet { get; set; }

    public GeometryEtDatapoint[] Datapoints { get; set; }
}
