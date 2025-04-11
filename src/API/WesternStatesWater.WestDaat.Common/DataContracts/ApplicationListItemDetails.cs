namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class ApplicationListItemDetails
{
    required public string ApplicantFullName { get; set; }

    required public string ApplicationDisplayId { get; set; }

    required public Guid ApplicationId { get; set; }

    public DateTimeOffset? ApprovedDate { get; set; }

    required public int CompensationRateDollars { get; set; }

    required public CompensationRateUnits CompensationRateUnits { get; set; }

    public DateTimeOffset? DeniedDate { get; set; }

    required public int EstimatedCompensationDollars { get; set; }

    required public string OrganizationName { get; set; }
    
    public DateTimeOffset? RecommendedAgainstDate { get; set; }
    
    public DateTimeOffset? RecommendedForDate { get; set; }

    required public DateTimeOffset SubmittedDate { get; set; }

    required public double CumulativeTotalEtInAcreFeet { get; set; }

    required public string WaterRightNativeId { get; set; }

    required public string WaterRightState { get; set; }
    
    required public Guid? RecommendedByUserId { get; set; }
}