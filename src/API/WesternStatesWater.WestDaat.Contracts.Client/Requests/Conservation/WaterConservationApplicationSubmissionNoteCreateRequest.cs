namespace WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;

public class WaterConservationApplicationSubmissionNoteCreateRequest : ApplicationStoreRequestBase
{
    public Guid WaterConservationApplicationId { get; set; }
    public string Note { get; set; }
}
