import { useState } from 'react';
import Button from 'react-bootstrap/esm/Button';
import Placeholder from 'react-bootstrap/esm/Placeholder';
import { useParams } from 'react-router-dom';
import { TableLoading } from '../../components/TableLoading';
import { useOrganizationQuery, useOrganizationUsersQuery } from '../../hooks/queries';

export function AdminOrganizationsUsersPage() {
  const { organizationId } = useParams();
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  const {
    data: organizationListResponse,
    isLoading: organizationListLoading,
    isError: organizationListErrored,
  } = useOrganizationQuery();
  const organization = organizationListResponse?.organizations.find((org) => org.organizationId === organizationId);

  const {
    data: organizationUsersListResponse,
    isLoading: organizationUsersListLoading,
    isError: organizationUsersListErrored,
  } = useOrganizationUsersQuery(organizationId);

  const pageTitle = () => {
    if (organizationListLoading || organizationUsersListLoading) {
      return (
        <Placeholder as="h1" animation="glow" className="fs-3 fw-bolder">
          <Placeholder xs={4} className="rounded" />
        </Placeholder>
      );
    }

    let titleText = '';
    if (organizationId) {
      if (organization) {
        titleText = organization.name;
      }
    }

    return <h1 className="fs-3 fw-bolder">{titleText}</h1>;
  };

  const addUserButton = () => {
    if (organizationListLoading || organizationUsersListLoading) {
      return (
        <div className="col">
          <Placeholder animation="glow" as="h1" className="d-flex justify-content-end">
            <Placeholder xs={3} md={2} className="rounded py-2"></Placeholder>
          </Placeholder>
        </div>
      );
    }

    if (!organizationListErrored && !organizationUsersListErrored) {
      return (
        <Button variant="primary" className="fw-bold px-5 py-2" onClick={() => setShowAddUserModal(true)}>
          Add User
        </Button>
      );
    }
  };

  return (
    <>
      <div className="overflow-y-auto h-100">
        <div className="m-3">
          {pageTitle()}

          <div className="d-flex justify-content-between my-4">
            <h2>Users</h2>
            {addUserButton()}
          </div>

          <TableLoading
            isLoading={organizationListLoading || organizationUsersListLoading}
            isErrored={organizationListErrored || organizationUsersListErrored}
          >
            (<pre>OrganizationUsers: {JSON.stringify(organizationUsersListResponse)}</pre>)
          </TableLoading>
        </div>
      </div>
    </>
  );
}
