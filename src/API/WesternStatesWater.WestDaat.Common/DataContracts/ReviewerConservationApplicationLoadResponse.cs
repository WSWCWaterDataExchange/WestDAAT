namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class ReviewerConservationApplicationLoadResponse : ApplicationLoadResponseBase
{
    public ApplicationDetails Application { get; set; } = null!;

    public ApplicationReviewNote[] Notes { get; set; } = null!;
}
