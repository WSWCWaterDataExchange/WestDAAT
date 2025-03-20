namespace WesternStatesWater.WestDaat.Contracts.Client.Requests.Admin;

public class ApplicationDocumentDownloadSasTokenRequest : FileSasTokenRequestBase
{
    public Guid WaterConservationApplicationDocumentId { get; set; }
}