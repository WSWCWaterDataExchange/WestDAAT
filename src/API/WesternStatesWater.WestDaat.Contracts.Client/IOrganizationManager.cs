using WesternStatesWater.WestDaat.Common;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Admin;
using WesternStatesWater.WestDaat.Contracts.Client.Responses.Admin;

namespace WesternStatesWater.WestDaat.Contracts.Client;

/// <summary>
/// Defines operations for interacting with organizations.
/// </summary>
public interface IOrganizationManager : IServiceContractBase
{
    Task<TResponse> Load<TRequest, TResponse>(TRequest request)
        where TRequest : OrganizationLoadRequestBase
        where TResponse : OrganizationLoadResponseBase;
}