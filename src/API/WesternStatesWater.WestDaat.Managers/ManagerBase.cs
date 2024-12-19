using Microsoft.Extensions.Logging;
using WesternStatesWater.Shared.DataContracts;
using WesternStatesWater.Shared.Errors;
using WesternStatesWater.Shared.Extensions;
using WesternStatesWater.WestDaat.Common;
using WesternStatesWater.WestDaat.Contracts.Client.SmokeTest;
using WesternStatesWater.WestDaat.Managers.Handlers;

namespace WesternStatesWater.WestDaat.Managers
{
    public abstract class ManagerBase : ServiceContractBase
    {
        private readonly IManagerRequestHandlerResolver _requestHandlerResolver;

        protected ManagerBase(IManagerRequestHandlerResolver resolver, ILogger logger)
        {
            _requestHandlerResolver = resolver;
            base.Logger = logger;
        }

        public override string TestMe(string input)
        {
            List<IServiceContractBase> engines = new List<IServiceContractBase> { };

            List<string> engineResults = new List<string>();

            engines.ForEach(engine => engineResults.Add(engine.TestMe(input)));

            List<IServiceContractBase> accessors = new List<IServiceContractBase>
            {
                //I*Accessor
            };

            List<string> accessorResults = new List<string>();

            accessors.ForEach(accessor => accessorResults.Add(accessor.TestMe(input)));

            List<string> utilityResults = new List<string>();

            List<IServiceContractBase> utilities = new List<IServiceContractBase> { };

            utilities.ForEach(utility => utilityResults.Add(utility.TestMe(input)));

            var result = new SmokeTestResult
            {
                Engines = engineResults.ToArray(),
                Manager = base.TestMe(input),
                Accessors = accessorResults.ToArray(),
                Utilities = utilityResults.ToArray()
            };

            return System.Text.Json.JsonSerializer.Serialize(result);
        }

        protected async Task<TResponse> ExecuteAsync<TRequest, TResponse>(TRequest request)
            where TRequest : RequestBase
            where TResponse : ResponseBase
        {
            try
            {
                var validationResult = await request.ValidateAsync();

                if (!validationResult.IsValid)
                {
                    return CreateErrorResponse<TResponse>(new ValidationError(validationResult.ToDictionary()));
                }

                var response = await _requestHandlerResolver
                    .Resolve<TRequest, TResponse>()
                    .Handle(request);

                return response;
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "An error occurred while processing the request");

                return CreateErrorResponse<TResponse>(new InternalError());
            }
        }

        private TResponse CreateErrorResponse<TResponse>(ErrorBase error) where TResponse : ResponseBase
        {
            try
            {
                var response = (TResponse)Activator.CreateInstance(typeof(TResponse))!;
                response.Error = error;

                return response;
            }
            catch (Exception ex)
            {
                Logger.LogError(
                    ex,
                    "Failed to create error response for type {ResponseTypeName} with error type {ErrorTypeName}",
                    typeof(TResponse).FullName,
                    error.GetType().FullName
                );

                return (TResponse)new ResponseBase { Error = new InternalError() };
            }
        }
    }
}