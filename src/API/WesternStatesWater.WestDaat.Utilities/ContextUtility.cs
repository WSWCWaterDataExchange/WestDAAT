using Microsoft.AspNetCore.Http;
using WesternStatesWater.WestDaat.Common.Context;

namespace WesternStatesWater.WestDaat.Utilities;

public class ContextUtility(IHttpContextAccessor httpContextAccessor) : IContextUtility
{
    private readonly ContextBase _context = Build(httpContextAccessor);

    private static ContextBase Build(IHttpContextAccessor httpContextAccessor)
    {
        if (httpContextAccessor.HttpContext.Request.Headers.TryGetValue("x-test-header", out _))
        {
            return new UserContext();
        }

        return new AnonymousContext();
    }

    public ContextBase GetContext() => _context;

    public T GetRequiredContext<T>() where T : ContextBase
    {
        if (_context is not T context)
        {
            throw new InvalidOperationException($"Request context is not of the type '{typeof(T).Name}'.");
        }

        return context;
    }
}