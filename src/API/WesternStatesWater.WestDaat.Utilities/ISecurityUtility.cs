using WesternStatesWater.Shared.DataContracts;
using WesternStatesWater.WestDaat.Common.Context;

namespace WesternStatesWater.WestDaat.Utilities;

public interface ISecurityUtility
{
    // TODO - Needed?
    Task<object> GetPermissions(ContextBase context);
    
    Task<bool> IsAuthorized(ContextBase context, RequestBase request);
}