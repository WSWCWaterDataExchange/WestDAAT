using WesternStatesWater.Shared.DataContracts;
using WesternStatesWater.WestDaat.Common.Context;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Admin;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;

namespace WesternStatesWater.WestDaat.Utilities;

internal class SecurityUtility : ISecurityUtility
{
    public Task<object> GetPermissions(ContextBase context)
    {
        return Task.FromResult((object)42);
    }

    public Task<bool> IsAuthorized(ContextBase context, RequestBase request)
    {
        return request switch
        {
            ApplicationStoreRequestBase => Task.FromResult(true),
            UserLoadRequestBase => Task.FromResult(true),
            _ => throw new NotImplementedException(
                $"Authorization for request type '{request.GetType().Name}' is not implemented."
            )
        };
    }
}