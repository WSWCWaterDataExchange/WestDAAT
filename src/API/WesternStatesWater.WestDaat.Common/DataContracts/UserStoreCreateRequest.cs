namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class UserStoreCreateRequest : UserStoreRequestBase
{
    public string Email { get; set; }

    public string ExternalAuthId { get; set; }
}
