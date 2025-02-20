using System.Net;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using WesternStatesWater.WestDaat.Contracts.Client;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Admin;
using WesternStatesWater.WestDaat.Contracts.Client.Responses.Admin;

namespace WesternStatesWater.WestDaat.Client.Functions;

public class UserFunction : FunctionBase
{
    private readonly IUserManager _userManager;
    private readonly ILogger _logger;

    private const string RouteBase = "Users";

    public UserFunction(IUserManager userManager, ILogger<UserFunction> logger)
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
}