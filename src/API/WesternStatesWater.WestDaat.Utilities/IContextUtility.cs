using WesternStatesWater.WestDaat.Common.Context;

namespace WesternStatesWater.WestDaat.Utilities;

public interface IContextUtility
{
    // todo doc comment, test, will be useful when we want context and don't know the type
    ContextBase GetContext();

    // todo doc comment, test, will be useful when we want the context and it must be of a specific type, else it's an error
    TContext GetRequiredContext<TContext>() where TContext : ContextBase;
}