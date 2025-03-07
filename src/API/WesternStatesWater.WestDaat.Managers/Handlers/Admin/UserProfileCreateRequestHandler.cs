using WesternStatesWater.Shared.Resolver;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Common.Context;
using WesternStatesWater.WestDaat.Common.DataContracts;
using WesternStatesWater.WestDaat.Engines;
using WesternStatesWater.WestDaat.Managers.Mapping;
using WesternStatesWater.WestDaat.Utilities;
using UserProfileCreateRequest = WesternStatesWater.WestDaat.Contracts.Client.Requests.Admin.UserProfileCreateRequest;
using UserStoreResponseBase = WesternStatesWater.WestDaat.Contracts.Client.Responses.Admin.UserStoreResponseBase;

namespace WesternStatesWater.WestDaat.Managers.Handlers.Admin;

public class UserProfileCreateRequestHandler : IRequestHandler<UserProfileCreateRequest, UserStoreResponseBase>
{
    public IUserAccessor UserAccessor { get; }

    public IContextUtility ContextUtility { get; }
    
    public IUserNameFormattingEngine UserNameFormattingEngine { get; }

    public UserProfileCreateRequestHandler(IUserAccessor userAccessor, IContextUtility contextUtility, IUserNameFormattingEngine userNameFormattingEngine)
    {
        UserAccessor = userAccessor;
        ContextUtility = contextUtility; 
        UserNameFormattingEngine = userNameFormattingEngine;
    }

    public async Task<UserStoreResponseBase> Handle(UserProfileCreateRequest request)
    {
        var accessorRequest = request.Map<Common.DataContracts.UserProfileCreateRequest>();
        accessorRequest.UserId = ContextUtility.GetRequiredContext<UserContext>().UserId;
        
        
        var usernameFormatRequest = new UserProfileUserNameFormatRequest
        {
            FirstName = accessorRequest.FirstName,
            LastName = accessorRequest.LastName
        };
        
        var usernameFormatResponse = (UserProfileUserNameFormatResponse) await UserNameFormattingEngine.Format(usernameFormatRequest);
        accessorRequest.UserName = usernameFormatResponse.UserName;
        
        await UserAccessor.Store(accessorRequest);
        return new UserStoreResponseBase();
    }
}