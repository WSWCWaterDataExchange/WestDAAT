using WesternStatesWater.WestDaat.Common;
using WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Accessors;

public interface IOrganizationAccessor : IServiceContractBase
{
    Task<OrganizationLoadResponseBase> Load(OrganizationLoadRequestBase request);
}