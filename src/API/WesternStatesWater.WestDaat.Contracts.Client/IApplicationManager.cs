using WesternStatesWater.WestDaat.Common;

namespace WesternStatesWater.WestDaat.Contracts.Client;

/// <summary>
/// Defines operations for managing the lifecycle of water conservation applications, 
/// including their creation, updating, retrieval, submission, review, and more.
/// </summary>
public interface IApplicationManager : IServiceContractBase
{
    Task<ApplicationLoadResponseBase> Load(ApplicationLoadRequestBase request);
    
    Task<ApplicationStoreResponseBase> Store(ApplicationStoreRequestBase request);
}