using WesternStatesWater.WestDaat.Common.Context;

namespace WesternStatesWater.WestDaat.Common.Extensions;

public static class ContextExtensions
{
    /// <summary>
    /// Converts the specified <see cref="ContextBase"/> instance into a log-friendly string representation.
    /// </summary>
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