namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class ApplicationDashboardLoadDetails
{
    required public string ApplicationDisplayId { get; set; }

    required public string ApplicantFullName { get; set; }

    required public int CompensationRateDollars { get; set; }

    required public CompensationRateUnits CompensationRateUnits { get; set; }

    required public string OrganizationName { get; set; }

    required public ConservationApplicationStatus Status { get; set; }

    required public DateTimeOffset SubmittedDate { get; set; }

    required public string State { get; set; }

    required public string WaterRightNativeId { get; set; }
}