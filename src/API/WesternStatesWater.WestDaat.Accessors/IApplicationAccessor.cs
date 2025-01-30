using WesternStatesWater.WestDaat.Common;
using WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Accessors;

public interface IApplicationAccessor : IServiceContractBase
{
    Task<ApplicationLoadResponseBase> Load(ApplicationLoadRequestBase request);
    
    Task<ApplicationStoreResponseBase> Store(ApplicationStoreRequestBase request);
}