using WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Contracts.Client.Responses.Conservation;

public class OrganizationApplicationDashboardListItem
{
    required public string ApplicationDisplayId { get; set; }

    required public string ApplicantFullName { get; set; }

    required public int CompensationRateDollars { get; set; }

    // TODO: JN - should this be a string too?
    required public string CompensationRateUnits { get; set; }

    required public string OrganizationName { get; set; }

    required public string Status { get; set; }

    required public DateTimeOffset SubmittedDate { get; set; }

    required public string State { get; set; }

    required public string WaterRightNativeId { get; set; }
}