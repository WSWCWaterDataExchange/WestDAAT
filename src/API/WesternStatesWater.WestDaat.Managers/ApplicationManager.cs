using WesternStatesWater.WestDaat.Contracts.Client;

namespace WesternStatesWater.WestDaat.Managers;

public partial class ConservationManager : IApplicationManager
{
    Task<ResponseBase> IApplicationManager.Load(RequestBase request)
    {
        return request switch
        {
            _ => throw new NotImplementedException()
        };
    }

    Task<ResponseBase> IApplicationManager.Store(RequestBase request)
    {
        return request switch
        {
            _ => throw new NotImplementedException()
        };
    }
}