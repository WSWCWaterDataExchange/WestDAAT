import Alert from 'react-bootstrap/esm/Alert';
import { useUserProfile } from '../../hooks/queries/useUserQuery';
import Placeholder from 'react-bootstrap/esm/Placeholder';
import Icon from '@mdi/react';
import { mdiInformationOutline } from '@mdi/js';
import { Role, RoleDisplayNames } from '../../config/role';
import { NavLink } from 'react-router-dom';

export function AccountInformationPage() {
  const {
    data: profileResponse, //
    isLoading: isProfileLoading,
    isError: hasProfileLoadError,
  } = useUserProfile();

  const profile = profileResponse?.userProfile;

  const labeledValue = (label: string, value: string | undefined) => {
    return (
      <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
        <div className="mb-4">
          {isProfileLoading && (
            <Placeholder animation="glow">
              <Placeholder xs={6} className="rounded" />
              <Placeholder xs={10} className="rounded" />
            </Placeholder>
          )}

          {!isProfileLoading && (
            <>
              <div className="text-muted">{label}</div>
              <div className="text-break">{value}</div>
            </>
          )}
        </div>
      </div>
    );
  };

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
    <div className="container mt-3">
      <h1 className="fw-bold fs-4 mb-4">My Account</h1>
      <h2 className="fs-4">Account Information</h2>
      <hr />

      {hasProfileLoadError && (
        <Alert variant="danger" className="d-flex align-items-center">
          <Icon path={mdiInformationOutline} size={1.3} />
          <span className="ms-2 fw-bold">There was an error loading your profile information. Please try again.</span>
        </Alert>
      )}

      {!hasProfileLoadError && (
        <>
          <div className="row">
            {labeledValue('Name', profile?.firstName + ' ' + profile?.lastName)}
            {labeledValue('Email', profile?.email)}
            {labeledValue('User ID', profile?.userName)}
            {labeledValue('State', profile?.state)}
            {labeledValue('Country', profile?.country)}
            {labeledValue('Phone', profile?.phoneNumber)}
          </div>

          <h2 className="fs-4">Organizations & Roles</h2>
          <hr />

          {isProfileLoading && organizationRolesPlaceholder}
          {!isProfileLoading && organizationRolesTable()}
        </>
      )}
    </div>
  );
}
