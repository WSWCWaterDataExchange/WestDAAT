using WesternStatesWater.WestDaat.Common.Context;

namespace WesternStatesWater.WestDaat.Utilities;

public interface IContextUtility
{
    T Resolve<T>() where T : ContextBase;
}