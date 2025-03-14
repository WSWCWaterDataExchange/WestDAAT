namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class ReviewerConservationApplicationLoadResponse : ApplicationLoadResponseBase
{
    public ApplicationDetails Application { get; set; } = null!;

    public NoteDetails[] Notes { get; set; } = null!;
}
