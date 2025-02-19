namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class UserListResponse : UserLoadResponseBase
{
    public UserListResult[] Users { get; set; }
}