using System.Reflection;

namespace WesternStatesWater.WestDaat.Common;

public static class Permissions
{
    public const string ApplicationDashboardLoad = "Application_Dashboard_Load";
    
    public const string ConservationApplicationLoad = "ConservationApplication_Load";

    public const string ConservationApplicationStore = "ConservationApplication_Store";

    public const string OrganizationLoadAll = "Organization_Load_All";

    public const string UserLoad = "User_Load";

    public static string[] AllPermissions()
    {
        return typeof(Permissions)
            .GetFields(BindingFlags.Public | BindingFlags.Static)
            .Where(f => f.FieldType == typeof(string))
            .Select(f => (string)f.GetValue(null))
            .ToArray();
    }
}