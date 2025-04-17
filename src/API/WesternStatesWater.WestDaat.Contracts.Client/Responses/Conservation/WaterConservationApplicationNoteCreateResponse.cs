using WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Contracts.Client.Responses.Conservation;

public class WaterConservationApplicationNoteCreateResponse : ApplicationStoreResponseBase
{
    public ApplicationReviewNote Note { get; set; }
}