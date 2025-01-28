using System.Net;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using WesternStatesWater.WestDaat.Contracts.Client;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;
using WesternStatesWater.WestDaat.Contracts.Client.Responses.Conservation;

namespace WesternStatesWater.WestDaat.Client.Functions;

public class ApplicationFunction : FunctionBase
{
    private readonly IApplicationManager _applicationManager;
    private readonly ILogger _logger;

    private const string RouteBase = "applications";

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
            ApplicationDashboardLoadRequest request => await _applicationManager.Load<ApplicationDashboardLoadRequest, ApplicationDashboardLoadResponse>(request),
            _ => throw new NotImplementedException($"Request type {applicationLoadRequest.GetType()} is not implemented.")
        };
        return await CreateResponse(req, result);
    }
}