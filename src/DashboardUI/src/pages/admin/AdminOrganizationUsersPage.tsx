import { useParams } from 'react-router-dom';
import { NotImplementedPlaceholder } from '../../components/NotImplementedAlert';

export function AdminOrganizationsUsersPage() {
  const { organizationId } = useParams();

  return (
    <div>
      <NotImplementedPlaceholder />

      <pre>OrganizationId: {organizationId}</pre>

      <h1>Organization Users Page</h1>
      <h2>Users</h2>
    </div>
  );
}
