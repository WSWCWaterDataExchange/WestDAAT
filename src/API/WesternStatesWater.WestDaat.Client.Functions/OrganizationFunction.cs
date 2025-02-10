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

    private const string RouteBase = "Organizations";

    public OrganizationFunction(IOrganizationManager organizationManager, ILogger<OrganizationFunction> logger)
    {
        _organizationManager = organizationManager;
        _logger = logger;
    }

    [Function(nameof(OrganizationSearch))]
    [OpenApiOperation(nameof(OrganizationSearch))]
    [OpenApiResponseWithBody(HttpStatusCode.OK, "OK", typeof(OrganizationLoadResponseBase))]
    public async Task<HttpResponseData> OrganizationSearch(
        [HttpTrigger(AuthorizationLevel.Function, "post", Route = $"{RouteBase}/Search")]
        HttpRequestData req)
    {
        var organizationLoadRequest = await ParseRequestBody<OrganizationLoadRequestBase>(req);
        var result = organizationLoadRequest switch
        {
            OrganizationLoadAllRequest request => await _organizationManager.Load<OrganizationLoadAllRequest, OrganizationLoadAllResponse>(request),
            _ => throw new NotImplementedException($"Request type {organizationLoadRequest.GetType()} is not implemented.")
        };
        return await CreateResponse(req, result);
    }
}