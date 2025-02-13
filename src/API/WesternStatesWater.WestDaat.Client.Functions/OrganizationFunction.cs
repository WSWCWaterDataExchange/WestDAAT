using System.Net;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
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
            OrganizationListDetailsRequest request => await _organizationManager.Load<OrganizationListDetailsRequest, OrganizationListDetailsResponse>(request),
            OrganizationListSummaryRequest request => await _organizationManager.Load<OrganizationListSummaryRequest, OrganizationListSummaryResponse>(request),
            _ => throw new NotImplementedException($"Request type {organizationLoadRequest.GetType()} is not implemented.")
        };
        return await CreateResponse(req, result);
    }

    [Function(nameof(OrganizationMembers))]
    [OpenApiOperation(nameof(OrganizationMembers))]
    [OpenApiResponseWithBody(HttpStatusCode.OK, "OK", typeof(OrganizationStoreResponseBase))]
    [OpenApiParameter("organizationId", In = ParameterLocation.Path, Required = true, Type = typeof(Guid))]
    public async Task<HttpResponseData> OrganizationMembers(
        [HttpTrigger(AuthorizationLevel.Function, "post", Route = $"{RouteBase}/{{organizationId}}/Members")]
        HttpRequestData req)
    {
        var organizationStoreRequest = await ParseRequestBody<OrganizationStoreRequestBase>(req);
        var result = organizationStoreRequest switch
        {
            OrganizationMemberAddRequest request => await _organizationManager.Store<OrganizationMemberAddRequest, OrganizationMemberAddResponse>(request),
            _ => throw new NotImplementedException($"Request type {organizationStoreRequest.GetType()} is not implemented.")
        };
        return await CreateResponse(req, result);
    }
}