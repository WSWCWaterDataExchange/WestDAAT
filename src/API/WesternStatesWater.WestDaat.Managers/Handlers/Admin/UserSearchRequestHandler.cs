using WesternStatesWater.Shared.Resolver;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Admin;
using WesternStatesWater.WestDaat.Contracts.Client.Responses.Admin;
using WesternStatesWater.WestDaat.Managers.Mapping;

namespace WesternStatesWater.WestDaat.Managers.Handlers.Admin;

public class UserSearchRequestHandler : IRequestHandler<UserSearchRequest, UserSearchResponse>
{
    public IUserAccessor UserAccessor { get; }

    public UserSearchRequestHandler(IUserAccessor userAccessor)
    {
        UserAccessor = userAccessor;
    }

    public async Task<UserSearchResponse> Handle(UserSearchRequest request)
    {
        var accessorRequest = request.Map<Common.DataContracts.UserSearchRequest>();
        var accessorResponse = (Common.DataContracts.UserSearchResponse)await UserAccessor.Load(accessorRequest);
        return accessorResponse.Map<UserSearchResponse>();
    }
}