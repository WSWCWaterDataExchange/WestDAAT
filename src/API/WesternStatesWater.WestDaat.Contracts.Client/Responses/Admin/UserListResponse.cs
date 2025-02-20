namespace WesternStatesWater.WestDaat.Contracts.Client.Responses.Admin;

public class UserListResponse : UserLoadResponseBase
{
    public UserListResult[] Users { get; set; }
}