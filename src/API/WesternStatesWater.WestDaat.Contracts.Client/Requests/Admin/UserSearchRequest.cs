namespace WesternStatesWater.WestDaat.Contracts.Client.Requests.Admin;

public class UserSearchRequest : UserLoadRequestBase
{
    public string SearchTerm { get; set; }
}