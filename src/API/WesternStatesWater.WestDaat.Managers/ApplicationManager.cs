using WesternStatesWater.WestDaat.Contracts.Client;
using WesternStatesWater.WestDaat.Contracts.Client.Application;

namespace WesternStatesWater.WestDaat.Managers;

public sealed partial class ConservationManager : IApplicationManager
{
    Task<ApplicationLoadResponseBase> IApplicationManager.Load(ApplicationLoadRequestBase request)
    {
        return request switch
        {
            _ => throw new NotImplementedException()
        };
    }

    Task<ApplicationStoreResponseBase> IApplicationManager.Store(ApplicationStoreRequestBase request)
    {
        return request switch
        {
            _ => throw new NotImplementedException()
        };
    }
}