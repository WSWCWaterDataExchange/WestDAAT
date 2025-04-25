namespace WesternStatesWater.WestDaat.Contracts.Client.Responses.Admin;

public class ApplicationMapImageUploadSasTokenResponse : FileSasTokenResponseBase
{
    public SasTokenDetails SasToken { get; set; }
}