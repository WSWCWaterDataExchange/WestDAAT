namespace WesternStatesWater.WestDaat.Contracts.Client.Responses.Admin;

public class ApplicationDocumentDownloadSasTokenResponse : FileSasTokenResponseBase
{
    public string SasToken { get; set; } = null!;
    public string FileName { get; set; } = null!;
}