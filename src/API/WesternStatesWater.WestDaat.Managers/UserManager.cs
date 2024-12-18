using WesternStatesWater.WestDaat.Contracts.Client;

namespace WesternStatesWater.WestDaat.Managers;

public sealed partial class AdminManager : IUserManager
{
    Task<ResponseBase> IUserManager.Load(RequestBase request)
    {
        return request switch
        {
            _ => throw new NotImplementedException()
        };
    }
}