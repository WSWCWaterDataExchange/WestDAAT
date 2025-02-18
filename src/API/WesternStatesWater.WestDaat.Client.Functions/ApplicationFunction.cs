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

    private const string RouteBase = "Applications";

    public ApplicationFunction(IApplicationManager applicationManager, ILogger<ApplicationFunction> logger)
    {
        _applicationManager = applicationManager;
        _logger = logger;
    }

    [Function(nameof(ApplicationSearch))]
    [OpenApiOperation(nameof(ApplicationSearch))]
    [OpenApiResponseWithBody(HttpStatusCode.OK, "OK", typeof(ApplicationLoadResponseBase))]
    public async Task<HttpResponseData> ApplicationSearch(
        [HttpTrigger(AuthorizationLevel.Function, "post", Route = $"{RouteBase}/search")]
        HttpRequestData req)
    {
        var applicationLoadRequest = await ParseRequestBody<ApplicationLoadRequestBase>(req);
        var result = applicationLoadRequest switch
        {
            OrganizationApplicationDashboardLoadRequest request => await _applicationManager.Load<OrganizationApplicationDashboardLoadRequest, OrganizationApplicationDashboardLoadResponse>(request),
            _ => throw new NotImplementedException($"Request type {applicationLoadRequest.GetType()} is not implemented.")
        };
        return await CreateResponse(req, result);
    }

    [Function(nameof(EstimateConsumptiveUse))]
    [OpenApiOperation(nameof(EstimateConsumptiveUse))]
    [OpenApiResponseWithBody(HttpStatusCode.OK, "OK", typeof(EstimateConsumptiveUseResponse))]
    public async Task<HttpResponseData> EstimateConsumptiveUse(
        [HttpTrigger(AuthorizationLevel.Function, "post", Route = $"{RouteBase}/EstimateConsumptiveUse")]
        HttpRequestData req)
    {
        var request = await ParseRequestBody<EstimateConsumptiveUseRequest>(req);
        var results = await _applicationManager.Store<EstimateConsumptiveUseRequest, EstimateConsumptiveUseResponse>(request);
        return await CreateResponse(req, results);
    }

    [Function(nameof(CreateWaterConservationApplication))]
    [OpenApiOperation(nameof(CreateWaterConservationApplication))]
    [OpenApiResponseWithBody(HttpStatusCode.OK, "OK", typeof(WaterConservationApplicationCreateResponse))]
    public async Task<HttpResponseData> CreateWaterConservationApplication(
        [HttpTrigger(AuthorizationLevel.Function, "post", Route = $"{RouteBase}")]
        HttpRequestData req)
    {
        var request = await ParseRequestBody<WaterConservationApplicationCreateRequest>(req);
        var results = await _applicationManager.Store<WaterConservationApplicationCreateRequest, WaterConservationApplicationCreateResponse>(request);
        return await CreateResponse(req, results);
    }
}
