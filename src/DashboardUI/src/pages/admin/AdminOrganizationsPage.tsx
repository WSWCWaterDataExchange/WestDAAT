import { useQuery } from 'react-query';
import { useAdminContext } from '../../contexts/AdminProvider';
import { getAllOrganizations } from '../../accessors/adminAccessor';
import { useMsal } from '@azure/msal-react';

export function AdminOrganizationsPage() {
  const adminContext = useAdminContext();
  const msalContext = useMsal();

  // TODO loading state
  // TODO error handling
  const { data: organizations } = useQuery('admin-organizations', () => getAllOrganizations(msalContext));

  return (
    <div>
      <h1>All Organizations</h1>

      <pre>{JSON.stringify(organizations, null, 2)}</pre>
      <pre>{JSON.stringify(adminContext, null, 2)}</pre>
    </div>
  );
}
