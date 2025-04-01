namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class ApplicationListItemDetails
{
    public DateTimeOffset? AcceptedDate { get; set; }

    required public string ApplicantFullName { get; set; }

    required public string ApplicationDisplayId { get; set; }

    required public Guid ApplicationId { get; set; }

    required public int CompensationRateDollars { get; set; }

    required public CompensationRateUnits CompensationRateUnits { get; set; }

    required public int EstimatedCompensationDollars { get; set; }

    required public string OrganizationName { get; set; }

    public DateTimeOffset? RejectedDate { get; set; }

    required public DateTimeOffset SubmittedDate { get; set; }

    required public double SumAverageYearlyTotalEtInAcreFeet { get; set; }

    required public string WaterRightNativeId { get; set; }

    required public string WaterRightState { get; set; }
}