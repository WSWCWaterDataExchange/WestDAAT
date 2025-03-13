namespace WesternStatesWater.WestDaat.Contracts.Client.Responses.Conservation;

public class ReviewerConservationApplicationLoadResponse : ApplicationLoadResponseBase
{
    public Common.DataContracts.ApplicationDetailsReviewerView Application { get; set; } = null!;
}
