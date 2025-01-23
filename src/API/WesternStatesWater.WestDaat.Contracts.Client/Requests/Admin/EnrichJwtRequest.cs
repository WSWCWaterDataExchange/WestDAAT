namespace WesternStatesWater.WestDaat.Contracts.Client.Requests.Admin;

public class EnrichJwtRequest : UserLoadRequestBase
{
    // This is the b2c user id which we consider the external auth id
    public string ObjectId { get; set; }

    public string Email { get; set; }
}
