namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class UserNameExistsRequest : UserLoadRequestBase
{
    required public string UserName { get; set; }
}