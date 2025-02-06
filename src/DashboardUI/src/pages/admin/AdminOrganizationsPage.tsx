import React from 'react';
import { useQuery } from 'react-query';
import { getAllOrganizations } from '../../accessors/organizationAccessor';
import { useMsal } from '@azure/msal-react';
import { Alert, Spinner } from 'react-bootstrap';

export function AdminOrganizationsPage() {
  const msalContext = useMsal();

  const {
    data: organizationsResponse,
    isLoading,
    isError,
    error,
  } = useQuery('admin-organizations', () => getAllOrganizations(msalContext));

  if (isLoading) {
    return (
      <div className="text-center">
        <Spinner animation="border" role="status" />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="danger">
        <Alert.Heading>Error loading organizations</Alert.Heading>
        <p>{(error as Error).message}</p>
      </Alert>
    );
  }

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
