using WesternStatesWater.WestDaat.Common.Context;

namespace WesternStatesWater.WestDaat.Utilities;

public interface ISecurityUtility
{
    Task<object> GetPermissions(ContextBase context);
}