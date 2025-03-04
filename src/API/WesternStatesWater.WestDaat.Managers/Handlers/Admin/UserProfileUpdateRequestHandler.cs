using WesternStatesWater.Shared.Resolver;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Common.Context;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Admin;
using WesternStatesWater.WestDaat.Contracts.Client.Responses.Admin;
using WesternStatesWater.WestDaat.Managers.Mapping;
using WesternStatesWater.WestDaat.Utilities;

namespace WesternStatesWater.WestDaat.Managers.Handlers.Admin;

public class UserProfileUpdateRequestHandler : IRequestHandler<UserProfileUpdateRequest, UserStoreResponseBase>
{
    public IUserAccessor UserAccessor { get; }

    public IContextUtility ContextUtility { get; }

    public UserProfileUpdateRequestHandler(IUserAccessor userAccessor, IContextUtility contextUtility)
    {
        UserAccessor = userAccessor;
        ContextUtility = contextUtility;
    }

    public async Task<UserStoreResponseBase> Handle(UserProfileUpdateRequest request)
    {
        var accessorRequest = request.Map<Common.DataContracts.UserProfileUpdateRequest>();
        accessorRequest.UserId = ContextUtility.GetRequiredContext<UserContext>().UserId;
        await UserAccessor.Store(accessorRequest);
        return new UserStoreResponseBase();
    }
}