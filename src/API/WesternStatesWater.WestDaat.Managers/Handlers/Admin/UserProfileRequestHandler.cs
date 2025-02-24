using WesternStatesWater.Shared.Resolver;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Common.Context;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Admin;
using WesternStatesWater.WestDaat.Contracts.Client.Responses.Admin;
using WesternStatesWater.WestDaat.Managers.Mapping;
using WesternStatesWater.WestDaat.Utilities;

namespace WesternStatesWater.WestDaat.Managers.Handlers.Admin;

public class UserProfileRequestHandler : IRequestHandler<UserProfileRequest, UserProfileResponse>
{
    public IUserAccessor UserAccessor { get; }

    public IContextUtility ContextUtility { get; }

    public UserProfileRequestHandler(IUserAccessor userAccessor, IContextUtility contextUtility)
    {
        UserAccessor = userAccessor;
        ContextUtility = contextUtility;
    }

    public async Task<UserProfileResponse> Handle(UserProfileRequest request)
    {
        var accessorRequest = request.Map<Common.DataContracts.UserProfileRequest>();
        accessorRequest.UserId = ContextUtility.GetRequiredContext<UserContext>().UserId;
        var accessorResponse = (Common.DataContracts.UserProfileResponse)await UserAccessor.Load(accessorRequest);
        return accessorResponse.Map<UserProfileResponse>();
    }
}