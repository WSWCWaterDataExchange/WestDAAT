using WesternStatesWater.WestDaat.Common;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Admin;
using WesternStatesWater.WestDaat.Contracts.Client.Responses.Admin;

namespace WesternStatesWater.WestDaat.Contracts.Client;

/// <summary>
/// Defines operations for managing user accounts, profiles, and related identity data. 
/// </summary>
public interface IUserManager : IServiceContractBase
{
    Task<TResponse> Load<TRequest, TResponse>(TRequest request)
        where TRequest : UserLoadRequestBase
        where TResponse : UserLoadResponseBase;
}