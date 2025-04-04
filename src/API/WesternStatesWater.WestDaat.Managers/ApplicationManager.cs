using WesternStatesWater.WestDaat.Contracts.Client;

namespace WesternStatesWater.WestDaat.Managers;

public sealed partial class ConservationManager : IApplicationManager
{
    async Task<TResponse> IApplicationManager.Load<TRequest, TResponse>(TRequest request)
    {
        return await ExecuteAsync<TRequest, TResponse>(request);
    }

    async Task<TResponse> IApplicationManager.Store<TRequest, TResponse>(TRequest request)
    {
        return await ExecuteAsync<TRequest, TResponse>(request);
    }

    async Task<TResponse> IApplicationManager.OnApplicationSubmitted<TRequest, TResponse>(TRequest request)
    {
        return await ExecuteAsync<TRequest, TResponse>(request);
    }

    async Task<TResponse> IApplicationManager.OnApplicationRecommended<TRequest, TResponse>(TRequest request)
    {
        return await ExecuteAsync<TRequest, TResponse>(request);
    }
}