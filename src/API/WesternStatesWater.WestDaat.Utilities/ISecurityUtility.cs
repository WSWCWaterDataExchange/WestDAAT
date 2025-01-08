using WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Utilities;

public interface ISecurityUtility
{
    string[] Get(PermissionsGetRequestBase request);
}