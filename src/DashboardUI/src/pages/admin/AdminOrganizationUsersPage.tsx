import { useParams } from 'react-router-dom';
import { NotImplementedPlaceholder } from '../../components/NotImplementedAlert';
import Button from 'react-bootstrap/esm/Button';
import { useState } from 'react';
import AddUserModal from './AddUserModal';

export function AdminOrganizationsUsersPage() {
  const { organizationId } = useParams();
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  return (
    <div>
      <div className="d-flex justify-content-between">
        <h1>Users</h1>
        <div>
          <Button variant="primary" className="fw-bold px-5 py-2" onClick={() => setShowAddUserModal(true)}>
            Add User
          </Button>
        </div>
      </div>

      <NotImplementedPlaceholder />

      <pre>OrganizationId: {organizationId}</pre>
      <pre>{showAddUserModal ? 'true' : 'false'}</pre>

      <AddUserModal show={showAddUserModal} onHide={() => setShowAddUserModal(false)} />
    </div>
  );
}
