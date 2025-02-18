// Should mirror Roles.cs
export enum Role {
  Member = 'Member',
  TechnicalReviewer = 'TechnicalReviewer',
  OrganizationAdmin = 'OrganizationAdmin',
  GlobalAdmin = 'GlobalAdmin',
}

export const RoleDisplayNames: { [key in Role]: string } = {
  Member: 'Member',
  TechnicalReviewer: 'Technical Reviewer',
  OrganizationAdmin: 'Organization Admin',
  GlobalAdmin: 'Global Admin',
};
