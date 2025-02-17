using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.IO;
using System.Net;
using WesternStatesWater.WestDaat.Contracts.Client;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Admin;
using WesternStatesWater.WestDaat.Contracts.Client.Responses.Admin;

namespace WesternStatesWater.WestDaat.Client.Functions;

public class AdminFunction : FunctionBase
{
    private readonly IUserManager _userManager;
    private readonly ILogger _logger;

    // "_" prefix is necessary because Azure Functions reserves the route "admin"
    private const string RouteBase = "_admin";

    public AdminFunction(IUserManager userManager, ILogger<AdminFunction> logger)
    {
        _userManager = userManager;
        _logger = logger;
    }

    [Function(nameof(EnrichJwt))]
    [OpenApiOperation(nameof(EnrichJwt))]
    [OpenApiResponseWithBody(HttpStatusCode.OK, "OK", typeof(EnrichJwtResponse))]
    public async Task<HttpResponseData> EnrichJwt(
        [HttpTrigger(AuthorizationLevel.Function, "post", Route = $"{RouteBase}/enrichJwt")]
        HttpRequestData req)
    {
        var enrichJwtRequest = await ParseRequestBody<EnrichJwtRequest>(req);
        var results = await _userManager.Load<EnrichJwtRequest, EnrichJwtResponse>(enrichJwtRequest);
        return await CreateResponse(req, results);
    }
}
