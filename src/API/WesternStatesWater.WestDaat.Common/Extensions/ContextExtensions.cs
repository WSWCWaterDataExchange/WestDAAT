using WesternStatesWater.WestDaat.Common.Context;

namespace WesternStatesWater.WestDaat.Common.Extensions;

public static class ContextExtensions
{
    // TODO test
    public static string ToLogString(this ContextBase context)
    {
        return context switch
        {
            AnonymousContext _ => "Unauthenticated request",
            UserContext userContext => $"User with ID '{userContext.UserId}'",
            _ => context.GetType().Name
        };
    }
}