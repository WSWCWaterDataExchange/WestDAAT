using WesternStatesWater.Shared.Errors;
using WesternStatesWater.Shared.Resolver;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Admin;
using WesternStatesWater.WestDaat.Contracts.Client.Responses.Admin;
using WesternStatesWater.WestDaat.Managers.Mapping;
using CommonContracts = WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Managers.Handlers.Admin;

public class EnrichJwtRequestHandler : IRequestHandler<EnrichJwtRequest, EnrichJwtResponse>
{
    public IUserAccessor UserAccessor { get; }

    public EnrichJwtRequestHandler(IUserAccessor userAccessor)
    {
        UserAccessor = userAccessor;
    }

    public async Task<EnrichJwtResponse> Handle(EnrichJwtRequest request)
    {
        var userExistsRequest = request.Map<CommonContracts.UserExistsRequest>();
        var userExistsResponse = (CommonContracts.UserExistsResponse)await UserAccessor.Load(userExistsRequest);

        if (!userExistsResponse.UserExists)
        {
            // To create user, email is required.
            if (request.Email is null)
            {
                return new EnrichJwtResponse
                {
                    Error = new ValidationError(new Dictionary<string, string[]>
                    {
                        { nameof(EnrichJwtRequest.Email), ["Email is required."] }
                    })
                };
            }

            var createUserRequest = request.Map<CommonContracts.UserStoreCreateRequest>();
            await UserAccessor.Store(createUserRequest);
        }

        var accessorRequest = request.Map<CommonContracts.UserLoadRolesRequest>();
        var accessorResponse = (CommonContracts.UserLoadRolesResponse)await UserAccessor.Load(accessorRequest);

        return accessorResponse.Map<EnrichJwtResponse>();
    }
}