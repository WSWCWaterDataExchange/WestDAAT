using WesternStatesWater.WestDaat.Contracts.Client;

namespace WesternStatesWater.WestDaat.Utilities;

// TODO Summary
public interface ISecurityUtility
{
    Task<bool> IsAuthorized(RequestBase request);
}