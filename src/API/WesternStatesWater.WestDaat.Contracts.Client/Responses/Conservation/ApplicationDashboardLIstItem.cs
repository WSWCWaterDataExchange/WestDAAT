using WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Contracts.Client.Responses.Conservation;

// TODO: JN - rename to not have double upper case
public class ApplicationDashboardLIstItem
{
    required public string ApplicantFullName { get; set; }

    required public string ApplicationDisplayId { get; set; }

    required public Guid ApplicationId { get; set; }
    
    required public int CompensationRateDollars { get; set; }

    required public CompensationRateUnits CompensationRateUnits { get; set; }

    required public string OrganizationName { get; set; }

    required public ConservationApplicationStatus Status { get; set; }

    required public DateTimeOffset SubmittedDate { get; set; }

    // TODO: JN - name seem okay?
    public int TotalObligationDollars { get; set; }

    required public double TotalWaterVolumeSavingsAcreFeet { get; set; } 

    required public string WaterRightNativeId { get; set; }
}