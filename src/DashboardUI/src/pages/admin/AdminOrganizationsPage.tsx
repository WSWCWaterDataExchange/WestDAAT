import { useQuery } from 'react-query';
import { getOrganizationDetailsList } from '../../accessors/organizationAccessor';
import { useMsal } from '@azure/msal-react';
import { TableLoading } from '../../components/TableLoading';
import { NavLink } from 'react-router-dom';

export function AdminOrganizationsPage() {
  const msalContext = useMsal();

  const {
    data: organizationsResponse,
    isLoading,
    isError,
  } = useQuery('admin-organizations', () => getOrganizationDetailsList(msalContext));

  return (
    <div className="container">
      <h1 className="fs-3">All Organizations</h1>

      <TableLoading isLoading={isLoading} isErrored={isError}>
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
                <td>
                  <NavLink to={`/admin/${organization.organizationId}/users`}>{organization.name}</NavLink>
                </td>
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
