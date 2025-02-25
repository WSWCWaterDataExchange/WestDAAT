namespace WesternStatesWater.WestDaat.Contracts.Client.Requests.Admin;

public class UserProfileRequest : UserLoadRequestBase
{
    /// <summary>
    /// Null will request current user's profile.
    /// </summary>
    public Guid? UserId { get; set; }
}