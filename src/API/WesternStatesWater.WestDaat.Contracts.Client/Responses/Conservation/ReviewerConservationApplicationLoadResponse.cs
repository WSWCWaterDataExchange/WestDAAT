namespace WesternStatesWater.WestDaat.Contracts.Client.Responses.Conservation;

public class ReviewerConservationApplicationLoadResponse : ApplicationLoadResponseBase
{
    public Common.DataContracts.ApplicationDetails Application { get; set; } = null!;

    public Common.DataContracts.NoteDetails[] Notes { get; set; } = null!;
}
