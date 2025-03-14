namespace WesternStatesWater.WestDaat.Contracts.Client.Responses.Conservation;

public class ReviewerConservationApplicationLoadResponse : ApplicationLoadResponseBase
{
    public Common.DataContracts.ApplicationDetails Application { get; set; } = null!;

    public Common.DataContracts.ApplicationReviewNote[] Notes { get; set; } = null!;
}
