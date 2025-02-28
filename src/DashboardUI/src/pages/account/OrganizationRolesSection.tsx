import Placeholder from 'react-bootstrap/esm/Placeholder';
import { Role, RoleDisplayNames } from '../../config/role';
import { NavLink } from 'react-router-dom';
import { UserProfile } from '../../data-contracts/UserProfile';

interface OrganizationRolesSectionProps {
  profile: UserProfile | undefined;
  isProfileLoading: boolean;
}

export function OrganizationRolesSection(props: OrganizationRolesSectionProps) {
  const { profile, isProfileLoading } = props;

  const organizationRolesPlaceholder = (
    <Placeholder animation="glow" className="d-flex w-100 gap-3 fs-3">
      <Placeholder xs={3} className="rounded" />
      <Placeholder xs={4} className="rounded" />
      <Placeholder xs={4} className="rounded" />
    </Placeholder>
  );

  const organizationPageLink = (role: Role, organizationId: string) => {
    if (role !== Role.OrganizationAdmin) {
      return null;
    }

    return <NavLink to={`/admin/${organizationId}/users`}>View Organization Page</NavLink>;
  };

  const organizationRolesTable = () => {
    return (
      <table className="table table-borderless">
        <thead>
          <tr>
            <th>Organization</th>
            <th>Role</th>
            <th>{/* Actions */}</th>
          </tr>
        </thead>
        <tbody>
          {profile?.organizationMemberships.length === 0 && (
            <tr>
              <td colSpan={2} className="text-muted text-center">
                No organizations found.
              </td>
            </tr>
          )}
          {profile?.organizationMemberships.map((membership) => (
            <tr key={membership.organizationId}>
              <td>{membership.organizationName}</td>
              <td>{RoleDisplayNames[membership.role] ?? '-'}</td>
              <td className="text-end">{organizationPageLink(membership.role, membership.organizationId)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <>
      <h2 className="fs-4">Organizations & Roles</h2>
      <hr />

      {isProfileLoading && organizationRolesPlaceholder}
      {!isProfileLoading && organizationRolesTable()}
    </>
  );
}
