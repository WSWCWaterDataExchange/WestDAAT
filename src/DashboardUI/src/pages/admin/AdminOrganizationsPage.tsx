import React from 'react';
import { useAdminContext } from '../../contexts/AdminProvider';
import { NotImplementedPlaceholder } from '../../components/NotImplementedAlert';

export function AdminOrganizationsPage() {
  const adminContext = useAdminContext();

  return (
    <div>
      <NotImplementedPlaceholder />
      
      <h1>All Organizations</h1>

      <pre>{JSON.stringify(adminContext.state.organizations, null, 2)}</pre>
    </div>
  );
}
