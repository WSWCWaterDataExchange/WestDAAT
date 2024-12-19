using WesternStatesWater.WestDaat.Contracts.Client;

namespace WesternStatesWater.WestDaat.Managers;

public sealed partial class AdminManager : IUserManager
{
    Task<UserLoadResponseBase> IUserManager.Load(UserLoadRequestBase request)
    {
        return request switch
        {
            _ => throw new NotImplementedException()
        };
    }
}