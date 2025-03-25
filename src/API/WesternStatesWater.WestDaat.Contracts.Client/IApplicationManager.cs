using WesternStatesWater.Shared.DataContracts;
using WesternStatesWater.WestDaat.Common;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;
using WesternStatesWater.WestDaat.Contracts.Client.Responses;
using WesternStatesWater.WestDaat.Contracts.Client.Responses.Conservation;

namespace WesternStatesWater.WestDaat.Contracts.Client;

/// <summary>
/// Defines operations for managing the lifecycle of water conservation applications, 
/// including their creation, updating, retrieval, submission, review, and more.
/// </summary>
public interface IApplicationManager : IServiceContractBase
{
    Task<TResponse> Load<TRequest, TResponse>(TRequest request)
        where TRequest : ApplicationLoadRequestBase
        where TResponse : ApplicationLoadResponseBase;

    Task<TResponse> Store<TRequest, TResponse>(TRequest request)
        where TRequest : ApplicationStoreRequestBase
        where TResponse : ApplicationStoreResponseBase;

    Task<TResponse> OnApplicationSubmitted<TRequest, TResponse>(TRequest request)
        where TRequest : WaterConservationApplicationSubmittedEvent
        where TResponse : EventResponseBase;
}