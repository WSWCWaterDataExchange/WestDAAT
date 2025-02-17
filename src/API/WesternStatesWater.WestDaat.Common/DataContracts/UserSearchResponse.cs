namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class UserSearchResponse : UserLoadResponseBase
{
    public UserSearchResult[] SearchResults { get; set; }
}