using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using System.Net;
using WesternStatesWater.WestDaat.Contracts.Client;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Admin;
using WesternStatesWater.WestDaat.Contracts.Client.Responses.Admin;

namespace WesternStatesWater.WestDaat.Client.Functions;

public class OrganizationFunction : FunctionBase
{
    private readonly IOrganizationManager _organizationManager;
    private readonly ILogger _logger;

    private const string RouteBase = "Organizations";

    public OrganizationFunction(IOrganizationManager organizationManager, ILogger<OrganizationFunction> logger) : base(logger)
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
        OrganizationLoadResponseBase result = organizationLoadRequest switch
        {
            OrganizationDetailsListRequest request => await _organizationManager.Load<OrganizationDetailsListRequest, OrganizationDetailsListResponse>(request),
            OrganizationSummaryListRequest request => await _organizationManager.Load<OrganizationSummaryListRequest, OrganizationSummaryListResponse>(request),
            OrganizationFundingDetailsRequest request => await _organizationManager.Load<OrganizationFundingDetailsRequest, OrganizationFundingDetailsResponse>(request),
            _ => throw new NotImplementedException($"Request type {organizationLoadRequest.GetType()} is not implemented.")
        };
        return await CreateResponse(req, result);
    }

    [Function(nameof(AddOrganizationMembers))]
    [OpenApiOperation(nameof(AddOrganizationMembers))]
    [OpenApiResponseWithBody(HttpStatusCode.OK, "OK", typeof(OrganizationStoreResponseBase))]
    [OpenApiParameter("organizationId", In = ParameterLocation.Path, Required = true, Type = typeof(Guid))]
    public async Task<HttpResponseData> AddOrganizationMembers(
        [HttpTrigger(AuthorizationLevel.Function, "post", Route = $"{RouteBase}/{{organizationId}}/Members")]
        HttpRequestData req, Guid organizationId)
    {
        var organizationStoreRequest = await ParseRequestBody<OrganizationStoreRequestBase>(req,
            new Dictionary<string, object> { { "OrganizationId", organizationId } }
        );

        var result = organizationStoreRequest switch
        {
            OrganizationMemberAddRequest request => await _organizationManager.Store<OrganizationMemberAddRequest, OrganizationMemberAddResponse>(request),
            _ => throw new NotImplementedException($"Request type {organizationStoreRequest.GetType()} is not implemented.")
        };
        return await CreateResponse(req, result);
    }

    [Function(nameof(RemoveOrganizationMembers))]
    [OpenApiOperation(nameof(RemoveOrganizationMembers))]
    [OpenApiResponseWithBody(HttpStatusCode.OK, "OK", typeof(OrganizationStoreResponseBase))]
    [OpenApiParameter("organizationId", In = ParameterLocation.Path, Required = true, Type = typeof(Guid))]
    public async Task<HttpResponseData> RemoveOrganizationMembers(
        [HttpTrigger(AuthorizationLevel.Function, "delete", Route = $"{RouteBase}/{{organizationId}}/Members")]
        HttpRequestData req, Guid organizationId)
    {
        var organizationStoreRequest = await ParseRequestBody<OrganizationStoreRequestBase>(req,
            new Dictionary<string, object> { { "OrganizationId", organizationId } });

        var result = organizationStoreRequest switch
        {
            OrganizationMemberRemoveRequest request => await _organizationManager.Store<OrganizationMemberRemoveRequest, OrganizationMemberRemoveResponse>(request),
            _ => throw new NotImplementedException($"Request type {organizationStoreRequest.GetType()} is not implemented.")
        };
        return await CreateResponse(req, result);
    }
    
    [Function(nameof(UpdateOrganizationMembers))]
    [OpenApiOperation(nameof(UpdateOrganizationMembers))]
    [OpenApiResponseWithBody(HttpStatusCode.OK, "OK", typeof(OrganizationStoreResponseBase))]
    [OpenApiParameter("organizationId", In = ParameterLocation.Path, Required = true, Type = typeof(Guid))]
    public async Task<HttpResponseData> UpdateOrganizationMembers(
        [HttpTrigger(AuthorizationLevel.Function, "put", Route = $"{RouteBase}/{{organizationId}}/Members")]
        HttpRequestData req, Guid organizationId)
    {
        var organizationStoreRequest = await ParseRequestBody<OrganizationStoreRequestBase>(req,
            new Dictionary<string, object> { { "OrganizationId", organizationId } });

        var result = organizationStoreRequest switch
        {
            OrganizationMemberUpdateRequest request => await _organizationManager.Store<OrganizationMemberUpdateRequest, OrganizationMemberUpdateResponse>(request),
            _ => throw new NotImplementedException($"Request type {organizationStoreRequest.GetType()} is not implemented.")
        };
        return await CreateResponse(req, result);
    }
}