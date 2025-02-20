using WesternStatesWater.Shared.Resolver;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Admin;
using WesternStatesWater.WestDaat.Contracts.Client.Responses.Admin;
using WesternStatesWater.WestDaat.Managers.Mapping;
using CommonContracts = WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Managers.Handlers.Admin;

public class UserListRequestHandler : IRequestHandler<UserListRequest, UserListResponse>
{
    public IUserAccessor UserAccessor { get; }

    public UserListRequestHandler(IUserAccessor userAccessor)
    {
        UserAccessor = userAccessor;
    }

    public async Task<UserListResponse> Handle(UserListRequest request)
    {
        var dto = request.Map<CommonContracts.UserListRequest>();
        var response = (CommonContracts.UserListResponse)await UserAccessor.Load(dto);
        return response.Map<UserListResponse>();
    }
}