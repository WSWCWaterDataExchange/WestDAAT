import { mdiPencilOutline, mdiTrashCanOutline } from '@mdi/js';
import Icon from '@mdi/react';
import { useState } from 'react';
import Button from 'react-bootstrap/esm/Button';
import Placeholder from 'react-bootstrap/esm/Placeholder';
import { useParams } from 'react-router-dom';
import { TableLoading } from '../../components/TableLoading';
import { Role, RoleDisplayNames } from '../../config/role';
import { useOrganizationQuery, useOrganizationUsersQuery } from '../../hooks/queries';
import { useAuthenticationContext } from '../../hooks/useAuthenticationContext';
import AddUserModal from './AddUserModal';
import { RemoveOrganizationUserModal } from './RemoveUserModal';
import { EditOrganizationUserModal } from './EditUserModal';

export function AdminOrganizationsUsersPage() {
  const { user: currentUser } = useAuthenticationContext();
  const { organizationId } = useParams();
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showRemoveUserModal, setShowRemoveUserModal] = useState(false);
  const [removeUserId, setRemoveUserId] = useState<string | null>(null);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [editUserId, setEditUserId] = useState<string | null>(null);

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
        <Placeholder as="h1" animation="glow" className="fs-3">
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

    return <h1 className="fs-3">{titleText}</h1>;
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

  const openRemoveUserModal = (userId: string) => {
    setShowRemoveUserModal(true);
    setRemoveUserId(userId);
  };

  const closeRemoveUserModal = () => {
    setShowRemoveUserModal(false);
    setRemoveUserId(null);
  };

  const openEditUserModal = (userId: string, role: Role) => {
    setShowEditUserModal(true);
    setEditUserId(userId);
  };

  const closeEditUserModal = () => {
    setShowEditUserModal(false);
    setEditUserId(null);
  };

  return (
    <div className="container">
      {pageTitle()}

      <div className="d-flex justify-content-between align-items-center my-4">
        <h2 className="fs-5">Users</h2>
        {addUserButton()}
      </div>

      <TableLoading
        isLoading={organizationListLoading || organizationUsersListLoading}
        isErrored={organizationListErrored || organizationUsersListErrored}
      >
        <table className="table">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Email</th>
              <th>User ID</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {organizationUsersListResponse?.users &&
              organizationUsersListResponse?.users.length > 0 &&
              organizationUsersListResponse?.users.map((user) => (
                <tr key={user.userId}>
                  <td className="align-content-center">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="align-content-center">{RoleDisplayNames[user.role]}</td>
                  <td className="align-content-center">
                    <Button variant="link" href={`mailto:${user.email}`} className="px-0 text-dark">
                      {user.email}
                    </Button>
                  </td>
                  <td className="align-content-center">{user.userName}</td>
                  <td className="align-content-center text-center">
                    {currentUser?.userId !== user.userId && (
                      <>
                        <Button
                          variant="link"
                          className="px-1 py-1"
                          onClick={() => openEditUserModal(user.userId, user.role)}
                        >
                          <Icon path={mdiPencilOutline} size="1.5em" aria-label="Edit user button"></Icon>
                        </Button>
                        <Button
                          variant="link"
                          className="px-1 py-1 text-danger"
                          onClick={() => openRemoveUserModal(user.userId)}
                        >
                          <Icon path={mdiTrashCanOutline} size="1.5em" aria-label="Remove user button"></Icon>
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            {organizationUsersListResponse?.users && organizationUsersListResponse?.users.length === 0 && (
              <tr key="noResults">
                <td colSpan={8} className="text-center py-2">
                  No results found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </TableLoading>
      <RemoveOrganizationUserModal
        show={showRemoveUserModal}
        userId={removeUserId}
        organizationId={organizationId}
        closeModal={closeRemoveUserModal}
      ></RemoveOrganizationUserModal>
      <EditOrganizationUserModal
        show={showEditUserModal}
        userId={editUserId}
        organizationId={organizationId}
        closeModal={closeEditUserModal}
      ></EditOrganizationUserModal>
      <AddUserModal organization={organization} show={showAddUserModal} onHide={() => setShowAddUserModal(false)} />
    </div>
  );
}
