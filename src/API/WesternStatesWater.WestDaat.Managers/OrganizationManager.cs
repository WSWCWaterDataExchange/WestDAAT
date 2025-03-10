using WesternStatesWater.WestDaat.Contracts.Client;

namespace WesternStatesWater.WestDaat.Managers;

public sealed partial class AdminManager : IOrganizationManager
{
    async Task<TResponse> IOrganizationManager.Load<TRequest, TResponse>(TRequest request)
    {
        return await ExecuteAsync<TRequest, TResponse>(request);
    }

    async Task<TResponse> IOrganizationManager.Store<TRequest, TResponse>(TRequest request)
    {
        return await ExecuteAsync<TRequest, TResponse>(request);
    }
}