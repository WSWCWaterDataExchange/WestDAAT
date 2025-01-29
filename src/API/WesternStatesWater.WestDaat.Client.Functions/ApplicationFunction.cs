using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using System.Net;
using WesternStatesWater.WestDaat.Contracts.Client;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;
using WesternStatesWater.WestDaat.Contracts.Client.Responses.Conservation;

namespace WesternStatesWater.WestDaat.Client.Functions;

public class ApplicationFunction : FunctionBase
{
    private readonly IApplicationManager _applicationManager;
    private readonly ILogger _logger;

    private const string RouteBase = "conservation";

    public ApplicationFunction(IApplicationManager applicationManager, ILogger<ApplicationFunction> logger)
    {
        _applicationManager = applicationManager;
        _logger = logger;
    }

    [Function(nameof(EstimateConsumptiveUse))]
    [OpenApiOperation(nameof(EstimateConsumptiveUse))]
    [OpenApiResponseWithBody(HttpStatusCode.OK, "OK", typeof(EstimateConsumptiveUseResponse))]
    public async Task<HttpResponseData> EstimateConsumptiveUse(
        [HttpTrigger(AuthorizationLevel.Function, "get", Route = $"{RouteBase}/estimate")]
        HttpRequestData req)
    {
        var calculateEtRequest = await ParseRequestBody<EstimateConsumptiveUseRequest>(req);
        var results = await _applicationManager.Store<EstimateConsumptiveUseRequest, EstimateConsumptiveUseResponse>(calculateEtRequest);
        return await CreateResponse(req, results);
    }
}
