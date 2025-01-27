using WesternStatesWater.WestDaat.Common.Context;

namespace WesternStatesWater.WestDaat.Common.DataContracts;

public abstract class PermissionsGetRequestBase
{
    required public ContextBase Context { get; init; } = null!;
}