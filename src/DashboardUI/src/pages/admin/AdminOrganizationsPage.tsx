import { useQuery } from 'react-query';
import { getAllOrganizations } from '../../accessors/adminAccessor';
import { useMsal } from '@azure/msal-react';

export function AdminOrganizationsPage() {
  const msalContext = useMsal();

  // TODO loading state
  // TODO error handling
  const { data: organizationsResponse } = useQuery('admin-organizations', () => getAllOrganizations(msalContext));

  return (
    <div>
      <h1>All Organizations</h1>

      <table className="table">
        <thead>
          <tr>
            <th>Organization Name</th>
            <th>Assigned Users</th>
            <th>Email Domain</th>
          </tr>
        </thead>
        <tbody>
          {organizationsResponse?.organizations?.map((organization) => (
            <tr key={organization.organizationId}>
              <td>{organization.name}</td>
              <td>{organization.userCount}</td>
              <td>{organization.emailDomain}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
