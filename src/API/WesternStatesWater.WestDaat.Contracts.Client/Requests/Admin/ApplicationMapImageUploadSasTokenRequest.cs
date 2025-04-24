namespace WesternStatesWater.WestDaat.Contracts.Client.Requests.Admin;

public class ApplicationMapImageUploadSasTokenRequest : FileSasTokenRequestBase
{
    public Guid ApplicationId { get; set; }
}