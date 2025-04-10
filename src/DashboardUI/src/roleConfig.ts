import { Role } from './config/role';

export enum Permission {
  ApplicationReview = 'Application_Review',
  ApplicationUpdate = 'Application_Update',
  ApplicationRecommendation = 'Application_Recommendation',
  ApplicationApprove = 'Application_Approve',
  OrganizationApplicationDashboardLoad = 'Organization_Application_Dashboard_Load',
  OrganizationDetailsList = 'Organization_List_Details',
  OrganizationMemberAdd = 'Organization_Member_Add',
  OrganizationMemberRemove = 'Organization_Member_Remove',
  OrganizationMemberUpdate = 'Organization_Member_Update',
  OrganizationUserList = 'Organization_User_List',
  UserList = 'User_List',
  UserSearch = 'User_Search',
}

export const RolePermissions: Record<Role, Permission[]> = {
  [Role.Member]: [
    Permission.ApplicationApprove,
    Permission.ApplicationReview,
    Permission.OrganizationApplicationDashboardLoad,
  ],
  [Role.TechnicalReviewer]: [
    Permission.ApplicationReview,
    Permission.ApplicationUpdate,
    Permission.ApplicationRecommendation,
    Permission.OrganizationApplicationDashboardLoad,
  ],
  [Role.OrganizationAdmin]: [
    Permission.ApplicationApprove,
    Permission.ApplicationReview,
    Permission.ApplicationUpdate,
    Permission.ApplicationRecommendation,
    Permission.OrganizationApplicationDashboardLoad,
    Permission.OrganizationMemberAdd,
    Permission.OrganizationMemberRemove,
    Permission.OrganizationMemberUpdate,
    Permission.OrganizationUserList,
    Permission.UserSearch,
  ],
  [Role.GlobalAdmin]: Object.values(Permission),
};
