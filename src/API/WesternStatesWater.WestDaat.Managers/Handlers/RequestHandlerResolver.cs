using WesternStatesWater.Shared.Resolver;

namespace WesternStatesWater.WestDaat.Managers.Handlers;

public class RequestHandlerResolver(IServiceProvider serviceProvider)
    : RequestHandlerResolverBase(serviceProvider), IManagerRequestHandlerResolver
{
    public override void ValidateTypeNamespace(Type requestType, Type responseType)
    {
        if (!requestType.Namespace!.Contains("Contracts.Client"))
        {
            throw new InvalidOperationException(
                $"Type {requestType.FullName} is not a valid request type."
                + " Request types must be in the WesternStatesWater.WestDaat.Contracts.Client namespace."
            );
        }

        if (!responseType.Namespace!.Contains("Contracts.Client"))
        {
            throw new InvalidOperationException(
                $"Type {responseType.FullName} is not a valid response type."
                + " Response types must be in the WesternStatesWater.WestDaat.Contracts.Client namespace."
            );
        }
    }
}