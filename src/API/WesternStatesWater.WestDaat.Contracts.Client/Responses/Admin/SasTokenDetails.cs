namespace WesternStatesWater.WestDaat.Contracts.Client.Responses.Admin;

public record SasTokenDetails
{
    public string Blobname { get; set; } = null!;
    public string SasToken { get; set; } = null!;
    public string Hostname { get; set; } = null!;
}