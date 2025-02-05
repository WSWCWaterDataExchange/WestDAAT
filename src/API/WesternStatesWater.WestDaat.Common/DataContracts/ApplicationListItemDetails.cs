namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class ApplicationListItemDetails
{
    public DateTimeOffset? AcceptedDate { get; set; }
    
    required public string ApplicantFullName { get; set; }

    required public string ApplicationDisplayId { get; set; }
    
    required public Guid ApplicationId { get; set; }

    required public int CompensationRateDollars { get; set; }

    required public CompensationRateUnits CompensationRateUnits { get; set; }
    
    public int EstimatedCompensationDollars { get; set; }
    
    required public string OrganizationName { get; set; }

    public DateTimeOffset? RejectedDate { get; set; }

    required public DateTimeOffset SubmittedDate { get; set; }

    required public ConsumptiveUseByLocation[] LocationsConsumptiveUses { get; set; }

    required public string WaterRightNativeId { get; set; }
}

public class ConsumptiveUseByLocation
{
    public double AreaInAcres { get; set; } // from location
    
    public double[] AllEtInInches { get; set; } // from consumptive uses
    
    // TODO: JN - this is on a location as well - what is this
    // public string PolygonWkt { get; set; } = null!;
}