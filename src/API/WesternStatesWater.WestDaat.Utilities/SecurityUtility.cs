using WesternStatesWater.WestDaat.Contracts.Client;

namespace WesternStatesWater.WestDaat.Utilities;

public class SecurityUtility : ISecurityUtility
{
    private readonly IContextUtility _contextUtility;

    public SecurityUtility(IContextUtility contextUtility)
    {
        _contextUtility = contextUtility;
    }

    public async Task<bool> IsAuthorized(RequestBase request)
    {
        return await Task.FromResult(true);
    }
}