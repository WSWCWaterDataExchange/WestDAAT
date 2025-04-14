using WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Contracts.Client.Responses.Conservation;

public class WaterConservationApplicationSubmissionNoteCreateResponse : ApplicationStoreResponseBase
{
    public ApplicationReviewNote Note { get; set; }
}