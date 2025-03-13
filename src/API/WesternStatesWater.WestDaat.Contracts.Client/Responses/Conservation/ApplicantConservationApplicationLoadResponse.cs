namespace WesternStatesWater.WestDaat.Contracts.Client.Responses.Conservation;

public class ApplicantConservationApplicationLoadResponse : ApplicationLoadResponseBase
{
    public Common.DataContracts.ApplicationDetailsApplicantView Application { get; set; } = null!;
}
