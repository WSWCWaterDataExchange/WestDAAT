namespace WesternStatesWater.WestDaat.Contracts.Client.Requests.Admin;

public class ApplicationDocumentUploadSasTokenRequest : FileSasTokenRequestBase
{
    public int FileUploadCount { get; set; }
}