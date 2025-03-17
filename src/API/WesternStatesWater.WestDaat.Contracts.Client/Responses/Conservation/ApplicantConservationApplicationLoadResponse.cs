namespace WesternStatesWater.WestDaat.Contracts.Client.Responses.Conservation;

public class ApplicantConservationApplicationLoadResponse : ApplicationLoadResponseBase
{
    public Common.DataContracts.ApplicationDetails Application { get; set; } = null!;
}
