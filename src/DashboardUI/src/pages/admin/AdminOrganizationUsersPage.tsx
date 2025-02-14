import { useParams } from 'react-router-dom';
import { NotImplementedPlaceholder } from '../../components/NotImplementedAlert';
import Button from 'react-bootstrap/esm/Button';
import { useState } from 'react';
import AddUserModal from './AddUserModal';
import { useOrganizationQuery } from '../../hooks/queries';
import Placeholder from 'react-bootstrap/esm/Placeholder';

export function AdminOrganizationsUsersPage() {
  const { organizationId } = useParams();
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  const { data: organizationListResponse, isLoading: organizationListLoading } = useOrganizationQuery();

  const pageTitle = () => {
    if (organizationListLoading) {
      return (
        <Placeholder as="h1" animation="glow" className="fs-3 fw-bolder">
          <Placeholder xs={4} className="rounded" />
        </Placeholder>
      );
    }

    let titleText = '';
    if (organizationId) {
      const organization = organizationListResponse?.organizations.find((org) => org.organizationId === organizationId);

      if (organization) {
        titleText = organization.name;
      }
    }

    return <h1 className="fs-3 fw-bolder">{titleText}</h1>;
  };

  return (
    <div>
      {pageTitle()}

      <div className="d-flex justify-content-between">
        <h2>Users</h2>
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
