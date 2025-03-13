namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class ReviewerConservationApplicationLoadResponse : ApplicationLoadResponseBase
{
    public ApplicationDetailsReviewerView Application { get; set; } = null!;
}
