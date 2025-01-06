using WesternStatesWater.WestDaat.Common.Context;

namespace WesternStatesWater.WestDaat.Utilities;

public interface ISecurityUtility
{
    string[] GetPermissions(ContextBase context, Guid organizationId);
}