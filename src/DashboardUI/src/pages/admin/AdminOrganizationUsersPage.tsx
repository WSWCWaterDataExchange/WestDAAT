import React from 'react';
import { useParams } from 'react-router-dom';

export function AdminOrganizationsUsersPage() {
  const { organizationId } = useParams();

  return (
    <div>
      <pre>OrganizationId: {organizationId}</pre>

      <h1>Organization Users Page</h1>
      <h2>Users</h2>
    </div>
  );
}
