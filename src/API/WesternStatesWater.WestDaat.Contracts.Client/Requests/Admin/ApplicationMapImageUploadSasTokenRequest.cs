namespace WesternStatesWater.WestDaat.Contracts.Client.Requests.Admin;

public class ApplicationMapImageUploadSasTokenRequest : FileSasTokenRequestBase
{
    public Guid WaterConservationApplicationId { get; set; }
}