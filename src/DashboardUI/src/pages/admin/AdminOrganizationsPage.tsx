import React from 'react';
import { useAdminContext } from '../../contexts/AdminProvider';

export function AdminOrganizationsPage() {
  const adminContext = useAdminContext();

  return (
    <div>
      <h1>All Organizations</h1>

      <pre>{JSON.stringify(adminContext.state.organizations, null, 2)}</pre>
    </div>
  );
}
