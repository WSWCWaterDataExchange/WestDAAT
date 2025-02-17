namespace WesternStatesWater.WestDaat.Contracts.Client.Responses.Admin;

public class UserSearchResponse : UserLoadResponseBase
{
    public UserSearchResult[] SearchResults { get; set; }
}