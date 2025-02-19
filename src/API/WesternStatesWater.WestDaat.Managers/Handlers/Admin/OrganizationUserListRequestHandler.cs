using WesternStatesWater.Shared.Resolver;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Common;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Admin;
using WesternStatesWater.WestDaat.Contracts.Client.Responses.Admin;

namespace WesternStatesWater.WestDaat.Managers.Handlers.Admin;

public class OrganizationUserListRequestHandler : IRequestHandler<OrganizationUserListRequest, UserListResponse>
{
    public IUserAccessor UserAccessor { get; }

    public OrganizationUserListRequestHandler(IUserAccessor userAccessor)
    {
        UserAccessor = userAccessor;
    }

    public async Task<UserListResponse> Handle(OrganizationUserListRequest request)
    {
        await Task.CompletedTask;

        return new UserListResponse
        {
            Users =
            [
                new UserListResult
                {
                    Email = "test@test.com",
                    Role = Roles.Member,
                    FirstName = "Tester",
                    LastName = "McTesterson",
                    UserId = Guid.NewGuid(),
                    UserName = "tmctester"
                }
            ]
        };
    }
}