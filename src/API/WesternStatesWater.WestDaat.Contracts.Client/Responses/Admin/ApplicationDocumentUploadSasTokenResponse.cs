namespace WesternStatesWater.WestDaat.Contracts.Client.Responses.Admin;

public class ApplicationDocumentUploadSasTokenResponse : FileSasTokenResponseBase
{
    public SasTokenDetails[] SasTokens { get; set; } = [];
}