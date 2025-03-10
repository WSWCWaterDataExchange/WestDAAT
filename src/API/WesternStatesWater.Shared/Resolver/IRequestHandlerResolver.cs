using WesternStatesWater.Shared.DataContracts;

namespace WesternStatesWater.Shared.Resolver;

public interface IRequestHandlerResolver
{
    IRequestHandler<TRequest, TResponse> Resolve<TRequest, TResponse>()
        where TRequest : RequestBase
        where TResponse : ResponseBase;
}