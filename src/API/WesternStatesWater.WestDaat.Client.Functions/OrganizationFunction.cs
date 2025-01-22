using System.Net;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using WesternStatesWater.WestDaat.Contracts.Client;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Admin;
using WesternStatesWater.WestDaat.Contracts.Client.Responses.Admin;

namespace WesternStatesWater.WestDaat.Client.Functions;

public class OrganizationFunction : FunctionBase
{
    private readonly IOrganizationManager _organizationManager;
    private readonly ILogger _logger;
    
    private const string RouteBase = "organizations";

    public OrganizationFunction(IOrganizationManager organizationManager, ILogger<OrganizationFunction> logger)
    {
        _organizationManager = organizationManager;
        _logger = logger;
    }
    
    [Function(nameof(OrganizationSearch))]
    [OpenApiOperation(nameof(OrganizationSearch))]
    [OpenApiResponseWithBody(HttpStatusCode.OK, "OK", typeof(OrganizationLoadResponseBase))]
    public async Task<HttpResponseData> OrganizationSearch(
        [HttpTrigger(AuthorizationLevel.Function, "post", Route = $"{RouteBase}/search")]
        HttpRequestData req)
    {
        var organizationLoadRequest = await ParseRequestBody<OrganizationLoadRequestBase>(req);
        var results = await _organizationManager.Load<OrganizationLoadRequestBase, OrganizationLoadResponseBase>(organizationLoadRequest);
        return await CreateResponse(req, results);
    }
}