using WesternStatesWater.WestDaat.Common;
using WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Accessors;

public interface IUserAccessor : IServiceContractBase
{
    Task<UserLoadRolesResponse> GetUserRoles(UserLoadRolesRequest request);
}