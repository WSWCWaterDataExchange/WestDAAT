﻿namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class PointEtDataCollection
{
    public Guid WaterConservationApplicationEstimateControlLocationId { get; set; }

    public string PointWkt { get; set; }

    public double AverageYearlyTotalEtInInches { get; set; }

    public GeometryEtDatapoint[] Datapoints { get; set; }
}
