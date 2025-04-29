// Should mirror Roles.cs
export enum Role {
  OrganizationMember = 'OrganizationMember',
  TechnicalReviewer = 'TechnicalReviewer',
  OrganizationAdmin = 'OrganizationAdmin',
  GlobalAdmin = 'GlobalAdmin',
}

export const RoleDisplayNames: { [key in Role]: string } = {
  OrganizationMember: 'Organization Member',
  TechnicalReviewer: 'Technical Reviewer',
  OrganizationAdmin: 'Organization Admin',
  GlobalAdmin: 'Global Admin',
};
