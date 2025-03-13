namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class ApplicantConservationApplicationLoadResponse : ApplicationLoadResponseBase
{
    public ApplicationDetailsApplicantView Application { get; set; } = null!;
}
