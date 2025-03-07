namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class UsernameExistsRequest : UserLoadRequestBase
{
    required public string Username { get; set; }
}