import { useQuery } from 'react-query';
import { getAllOrganizations } from '../../accessors/organizationAccessor';
import { useMsal } from '@azure/msal-react';
import { TableLoading } from '../../components/TableLoading';

export function AdminOrganizationsPage() {
  const msalContext = useMsal();

  const {
    data: organizationsResponse,
    isLoading,
    isError,
  } = useQuery('admin-organizations', () => getAllOrganizations(msalContext));

  return (
    <div>
      <h1 className="fs-3">All Organizations</h1>

      <TableLoading isLoading={isLoading} isErrored={isError}>
        {/* TODO style this */}
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
      </TableLoading>
    </div>
  );
}
