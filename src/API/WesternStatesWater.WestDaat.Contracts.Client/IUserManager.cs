using WesternStatesWater.WestDaat.Common;

namespace WesternStatesWater.WestDaat.Contracts.Client;

/// <summary>
/// Defines operations for managing user accounts, profiles, and related identity data. 
/// </summary>
public interface IUserManager : IServiceContractBase
{
    Task<ResponseBase> Load(RequestBase request);
}