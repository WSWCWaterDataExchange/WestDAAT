using System.Reflection;

namespace WesternStatesWater.WestDaat.Common;

public static class Permissions
{
    public const string ApplicationReview = "Application_Review";
    public const string ApplicationUpdate = "Application_Update";
    public const string ApplicationRecommendation = "Application_Recommendation";
    public const string ApplicationApprove = "Application_Approve";
    public const string ApplicationNoteCreate = "ApplicationNote_Create";
    public const string OrganizationApplicationDashboardLoad = "Organization_Application_Dashboard_Load";
    public const string OrganizationDetailsList = "Organization_List_Details";
    public const string OrganizationMemberAdd = "Organization_Member_Add";
    public const string OrganizationMemberRemove = "Organization_Member_Remove";
    public const string OrganizationMemberUpdate = "Organization_Member_Update";
    public const string OrganizationUserList = "Organization_User_List";
    public const string UserList = "User_List";
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