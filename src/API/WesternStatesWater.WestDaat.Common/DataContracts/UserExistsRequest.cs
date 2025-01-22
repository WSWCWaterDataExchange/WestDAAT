namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class UserExistsRequest : UserLoadRequestBase
{
    public string ExternalAuthId { get; set; }
}
