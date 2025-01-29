using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using System.Net;
using WesternStatesWater.WestDaat.Contracts.Client;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;
using WesternStatesWater.WestDaat.Contracts.Client.Responses.Conservation;

namespace WesternStatesWater.WestDaat.Client.Functions;

public class ConservationFunction : FunctionBase
{
    private readonly IApplicationManager _applicationManager;
    private readonly ILogger _logger;

    private const string RouteBase = "conservation";

    public ConservationFunction(IApplicationManager applicationManager, ILogger<ConservationFunction> logger)
    {
        _applicationManager = applicationManager;
        _logger = logger;
    }

    [Function(nameof(EstimateEvapotranspiration))]
    [OpenApiOperation(nameof(EstimateEvapotranspiration))]
    [OpenApiResponseWithBody(HttpStatusCode.OK, "OK", typeof(EstimateEvapotranspirationResponse))]
    public async Task<HttpResponseData> EstimateEvapotranspiration(
        [HttpTrigger(AuthorizationLevel.Function, "get", Route = $"{RouteBase}/estimate")]
        HttpRequestData req)
    {
        var calculateEtRequest = await ParseRequestBody<EstimateEvapotranspirationRequest>(req);
        var results = await _applicationManager.Store<EstimateEvapotranspirationRequest, EstimateEvapotranspirationResponse>(calculateEtRequest);
        return await CreateResponse(req, results);
    }
}
