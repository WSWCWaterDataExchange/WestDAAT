using WesternStatesWater.WestDaat.Common.Context;

namespace WesternStatesWater.WestDaat.Common.DataContracts;

public abstract class UserPermissionsGetRequestBase : PermissionsGetRequestBase
{
    public ContextBase Context { get; set; } = null!;
}