using Microsoft.Extensions.Logging;
using WesternStatesWater.Shared.DataContracts;
using WesternStatesWater.Shared.Errors;
using WesternStatesWater.Shared.Extensions;
using WesternStatesWater.WestDaat.Common;
using WesternStatesWater.WestDaat.Contracts.Client.SmokeTest;
using WesternStatesWater.WestDaat.Engines;
using WesternStatesWater.WestDaat.Managers.Handlers;

namespace WesternStatesWater.WestDaat.Managers
{
    public abstract class ManagerBase : ServiceContractBase
    {
        private readonly IManagerRequestHandlerResolver _requestHandlerResolver;

        private readonly IValidationEngine _validationEngine;

        protected ManagerBase(
            IManagerRequestHandlerResolver resolver,
            IValidationEngine validationEngine,
            ILogger logger
        )
        {
            _requestHandlerResolver = resolver;
            _validationEngine = validationEngine;

            Logger = logger;
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

        /// <summary>
        /// Executes the request pipeline for the specified request type, performing validation, handling the request,
        /// and returning the appropriate response.
        /// </summary>
        /// <typeparam name="TRequest">The type of the request being processed. Must inherit from <see cref="RequestBase"/>.</typeparam>
        /// <typeparam name="TResponse">The type of the response to be returned. Must inherit from <see cref="ResponseBase"/>.</typeparam>
        /// <param name="request">The request object to process.</param>
        /// <returns>
        /// A task that represents the asynchronous operation. The result is a <typeparamref name="TResponse"/> object
        /// containing either a successful response or an error response if validation or processing fails.
        /// </returns>
        /// <exception cref="Exception">
        /// Logs and catches any unhandled exception that occurs during request processing, returning an 
        /// <see cref="InternalError"/> encapsulated in the response.
        /// </exception>
        /// <remarks>
        /// This method performs the following steps:
        /// <list type="number">
        ///     <item><description>Validates the input request using fast-fail validation rules (e.g., missing required fields).</description></item>
        ///     <item><description>Performs business logic and access control validation using the validation engine.</description></item>
        ///     <item><description>Resolves and invokes the appropriate request handler to process the request and generate a response.</description></item>
        ///     <item><description>Handles any exceptions by logging them and returning an <see cref="InternalError"/> as the response.</description></item>
        /// </list>
        /// The method ensures that any errors encountered during validation or processing are captured and
        /// appropriately transformed into an error response of type <typeparamref name="TResponse"/>.
        /// </remarks>
        protected async Task<TResponse> ExecuteAsync<TRequest, TResponse>(TRequest request)
            where TRequest : RequestBase
            where TResponse : ResponseBase
        {
            try
            {
                var inputValidationResult = await request.ValidateAsync();

                if (!inputValidationResult.IsValid)
                {
                    return CreateErrorResponse<TRequest, TResponse>(
                        new ValidationError(inputValidationResult.ToDictionary())
                    );
                }

                var engineValidationResult = await _validationEngine.Validate(request);

                if (engineValidationResult is not null)
                {
                    Logger.LogError(
                        "Request type '{RequestTypeName}' failed validation: {LogMessage}",
                        typeof(TRequest).FullName,
                        engineValidationResult.LogMessage
                    );

                    return CreateErrorResponse<TRequest, TResponse>(engineValidationResult);
                }

                var response = await _requestHandlerResolver
                    .Resolve<TRequest, TResponse>()
                    .Handle(request);

                return response;
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "An error occurred while processing the request");

                return CreateErrorResponse<TRequest, TResponse>(new InternalError());
            }
        }

        private TResponse CreateErrorResponse<TRequest, TResponse>(ErrorBase error) where TResponse : ResponseBase
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
                    "Failed to create error response for request type '{RequestTypeName}', response type '{ResponseTypeName}', and error type {ErrorTypeName}",
                    typeof(TRequest).FullName,
                    typeof(TResponse).FullName,
                    error.GetType().FullName
                );

                return (TResponse)new ResponseBase { Error = new InternalError() };
            }
        }
    }
}