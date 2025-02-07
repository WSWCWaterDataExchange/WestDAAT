import React from 'react';
import { useQuery } from 'react-query';
import { getAllOrganizations } from '../../accessors/organizationAccessor';
import { useMsal } from '@azure/msal-react';
import { Alert, Placeholder } from 'react-bootstrap';
import Icon from '@mdi/react';
import { mdiAlertCircle } from '@mdi/js';

export function AdminOrganizationsPage() {
  const msalContext = useMsal();

  const {
    data: organizationsResponse,
    isLoading,
    isError,
  } = useQuery('admin-organizations', () => getAllOrganizations(msalContext));

  return (
    <div>
      <h1>All Organizations</h1>

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

export function TableLoading(props: { isLoading: boolean; isErrored?: boolean; children?: React.ReactNode }) {
  // if (props.isErrored) {
  //   return (
  //     <Alert variant="danger" className="mt-3 d-flex fw-bold">
  //       <Icon path={mdiAlertCircle} className="me-2" />
  //       An error occurred while loading the data request. It may have been deleted. Please try again.
  //     </Alert>
  //   );
  // }

  // return props.isLoading ? (
  return (
    <div className="d-flex mx-4">
      <table className="w-100">
        <thead>
          <tr>
            {[1, 2, 3, 4].map((i) => (
              <td key={i} className="p-2 ps-0 border-bottom">
                <Placeholder animation="glow">
                  <Placeholder xs={12} style={{ height: 32 }} className="rounded" />
                </Placeholder>
              </td>
            ))}
          </tr>
        </thead>

        <tbody>
          {[...Array(10).keys()].map((i) => (
            <tr key={i}>
              {[1, 2, 3, 4].map((i) => (
                <td key={i} className="p-2">
                  <Placeholder animation="glow">
                    <Placeholder
                      xs={[4, 6, 8, 10][Math.floor(Math.random() * 4)]}
                      style={{ height: 24 }}
                      className="rounded"
                    />
                  </Placeholder>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // : (
  //   props.children
  // );
}
