using WesternStatesWater.WestDaat.Common.Context;

namespace WesternStatesWater.WestDaat.Utilities;

internal class SecurityUtility : ISecurityUtility
{
    public Task<object> GetPermissions(ContextBase context)
    {
        return Task.FromResult((object)42);
    }
}