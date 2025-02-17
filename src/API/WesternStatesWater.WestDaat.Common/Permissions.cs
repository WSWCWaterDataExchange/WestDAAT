using System.Reflection;

namespace WesternStatesWater.WestDaat.Common;

public static class Permissions
{
    public const string OrganizationApplicationDashboardLoad = "Organization_Application_Dashboard_Load";
    public const string OrganizationDetailsList = "Organization_List_Details";
    public const string OrganizationMemberAdd = "Organization_Member_Add";
    public const string UserSearch = "User_Search";

    public static string[] AllPermissions()
    {
        return typeof(Permissions)
            .GetFields(BindingFlags.Public | BindingFlags.Static)
            .Where(f => f.FieldType == typeof(string))
            .Select(f => (string)f.GetValue(null))
            .ToArray();
    }
}