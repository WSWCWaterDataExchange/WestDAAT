namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class ApplicationDetailsReviewerView : ApplicationDetailsBase
{
    // returned in chronological order; oldest to newest
    public NoteDetails[] Notes { get; set; } = null!;
}
