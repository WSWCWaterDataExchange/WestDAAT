namespace WesternStatesWater.WestDaat.Contracts.Client.Responses.Admin;

public class EnrichJwtResponse : UserLoadResponseBase
{
    public string Version { get; set; }
    public string Action { get; set; }
    public string Extension_WestDaat_Roles { get; set; }
}
