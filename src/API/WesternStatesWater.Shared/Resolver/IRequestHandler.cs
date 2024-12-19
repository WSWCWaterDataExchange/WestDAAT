using WesternStatesWater.Shared.DataContracts;

namespace WesternStatesWater.Shared.Resolver;

public interface IRequestHandler<in TRequest, TResponse>
    where TRequest : RequestBase
    where TResponse : ResponseBase
{
    Task<TResponse> Handle(TRequest request);
}