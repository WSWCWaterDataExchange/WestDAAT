namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class UserSearchRequest : UserLoadRequestBase
{
    required public string SearchTerm { get; set; }
}