using WesternStatesWater.WestDaat.Contracts.Client;

namespace WesternStatesWater.WestDaat.Managers;

public sealed partial class AdminManager : IUserManager
{
    async Task<TResponse> IUserManager.Load<TRequest, TResponse>(TRequest request)
    {
        return await ExecuteAsync<TRequest, TResponse>(request);
    }

    async Task<TResponse> IUserManager.Store<TRequest, TResponse>(TRequest request)
    {
        return await ExecuteAsync<TRequest, TResponse>(request);
    }
}