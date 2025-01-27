using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using WesternStatesWater.WestDaat.Contracts.Client;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;
using WesternStatesWater.WestDaat.Contracts.Client.Responses.Conservation;

namespace WesternStatesWater.WestDaat.Client.Functions;

public class ConservationFunction : FunctionBase
{
    private readonly IApplicationManager _applicationManager;
    private readonly ILogger _logger;

    private const string RouteBase = "Conservation";

    public ConservationFunction(IApplicationManager applicationManager, ILogger<ConservationFunction> logger)
    {
        _applicationManager = applicationManager;
        _logger = logger;
    }

    public async Task<HttpResponseData> CalculateEvapotranspiration(
        [HttpTrigger(AuthorizationLevel.Function, "get", Route = $"{RouteBase}/calculateEt")],
        HttpRequestData req)
    {
        var calculateEtRequest = await ParseRequestBody<CalculateEvapotranspirationRequest>(req);
        var results = await _applicationManager.Load<CalculateEvapotranspirationRequest, CalculateEvapotranspirationResponse>(calculateEtRequest);
        return await CreateResponse(req, results);
    }
}
