using WesternStatesWater.WestDaat.Common;

namespace WesternStatesWater.WestDaat.Contracts.Client;

public interface IApplicationManager : IServiceContractBase
{
    Task<ResponseBase> Load(RequestBase request);
    
    Task<ResponseBase> Store(RequestBase request);
}