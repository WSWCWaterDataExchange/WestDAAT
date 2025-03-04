using System.Net;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using WesternStatesWater.Shared.DataContracts;
using WesternStatesWater.WestDaat.Contracts.Client;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Admin;
using WesternStatesWater.WestDaat.Contracts.Client.Responses.Admin;

namespace WesternStatesWater.WestDaat.Client.Functions;

public class UserFunction : FunctionBase
{
    private readonly IUserManager _userManager;
    private readonly ILogger _logger;

    private const string RouteBase = "Users";

    public UserFunction(IUserManager userManager, ILogger<UserFunction> logger) : base(logger)
    {
        _userManager = userManager;
        _logger = logger;
    }

    [Function(nameof(UserSearch))]
    [OpenApiOperation(nameof(UserSearch))]
    [OpenApiResponseWithBody(HttpStatusCode.OK, "OK", typeof(UserLoadResponseBase))]
    public async Task<HttpResponseData> UserSearch(
        [HttpTrigger(AuthorizationLevel.Function, "post", Route = $"{RouteBase}/Search")]
        HttpRequestData req)
    {
        var userLoadRequest = await ParseRequestBody<UserLoadRequestBase>(req);
        UserLoadResponseBase result = userLoadRequest switch
        {
            OrganizationUserListRequest request => await _userManager.Load<OrganizationUserListRequest, UserListResponse>(request),
            UserListRequest request => await _userManager.Load<UserListRequest, UserListResponse>(request),
            UserSearchRequest request => await _userManager.Load<UserSearchRequest, UserSearchResponse>(request),
            _ => throw new NotImplementedException($"Request type {userLoadRequest.GetType()} is not implemented.")
        };
        return await CreateResponse(req, result);
    }

    [Function(nameof(UserProfile))]
    [OpenApiOperation(nameof(UserProfile))]
    [OpenApiResponseWithBody(HttpStatusCode.OK, "OK", typeof(UserProfileResponse))]
    public async Task<HttpResponseData> UserProfile(
        [HttpTrigger(AuthorizationLevel.Function, "post", Route = $"{RouteBase}/Profile")]
        HttpRequestData req)
    {
        var userProfileRequest = await ParseRequestBody<UserProfileRequest>(req);
        var result = await _userManager.Load<UserProfileRequest, UserProfileResponse>(userProfileRequest);
        return await CreateResponse(req, result);
    }

    [Function(nameof(UpdateUserProfile))]
    [OpenApiOperation(nameof(UpdateUserProfile))]
    [OpenApiResponseWithBody(HttpStatusCode.OK, "OK", typeof(UserStoreResponseBase))]
    public async Task<HttpResponseData> UpdateUserProfile(
        [HttpTrigger(AuthorizationLevel.Function, "put", Route = $"{RouteBase}/Profile")]
        HttpRequestData req)
    {
        var requestBase = await ParseRequestBody<UserStoreRequestBase>(req);
        ResponseBase result = requestBase switch
        {
            UserProfileUpdateRequest request => await _userManager.Store<UserProfileUpdateRequest, UserStoreResponseBase>(request),
            _ => throw new NotImplementedException($"Request type {requestBase.GetType()} is not implemented.")
        };
        return await CreateResponse(req, result);
    }
}