import React from 'react';
import { useParams } from 'react-router-dom';

export function AdminOrganizationsUsersPage() {
  const { organizationId } = useParams();

  return (
    <div>
      <h1>Organization Users Page</h1>
      <pre>OrganizationId: {organizationId}</pre>
    </div>
  );
}
