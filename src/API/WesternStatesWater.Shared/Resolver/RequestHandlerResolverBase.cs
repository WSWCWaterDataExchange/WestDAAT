using WesternStatesWater.Shared.DataContracts;

namespace WesternStatesWater.Shared.Resolver;

public abstract class RequestHandlerResolverBase : IRequestHandlerResolver
{
    protected IServiceProvider ServiceProvider { get; }

    public RequestHandlerResolverBase(IServiceProvider serviceProvider)
    {
        ServiceProvider = serviceProvider;
    }

    public abstract void ValidateTypeNamespace(Type requestType, Type responseType);

    public IRequestHandler<TRequest, TResponse> Resolve<TRequest, TResponse>()
        where TRequest : RequestBase
        where TResponse : ResponseBase
    {
        var requestType = typeof(TRequest);
        var responseType = typeof(TResponse);

        if (requestType.Namespace is null)
        {
            throw new InvalidOperationException($"Type {requestType.FullName} is not a valid request type."
                                                + " Request types must be in a namespace.");
        }

        if (responseType.Namespace is null)
        {
            throw new InvalidOperationException($"Type {responseType.FullName} is not a valid response type."
                                                + " Response types must be in a namespace.");
        }

        ValidateTypeNamespace(requestType, responseType);

        var handlerType = typeof(IRequestHandler<,>).MakeGenericType(requestType, responseType);
        var handler = ServiceProvider.GetService(handlerType);

        if (handler is null)
        {
            throw new InvalidOperationException($"No handler found for request type {requestType.FullName}.");
        }

        return (IRequestHandler<TRequest, TResponse>)handler;
    }
}