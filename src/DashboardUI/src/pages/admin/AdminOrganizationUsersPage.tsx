import { useState } from 'react';
import Button from 'react-bootstrap/esm/Button';
import Placeholder from 'react-bootstrap/esm/Placeholder';
import { useParams } from 'react-router-dom';
import { TableLoading } from '../../components/TableLoading';
import { useOrganizationQuery, useOrganizationUsersQuery } from '../../hooks/queries';
import { RoleDisplayNames } from '../../config/role';

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

  return (
    <>
      <div className="overflow-y-auto h-100">
        <div className="m-3">
          {pageTitle()}

          <div className="d-flex justify-content-between align-items-center my-4">
            <h2 className="fs-5">Users</h2>
            {addUserButton()}
          </div>

          <TableLoading
            isLoading={organizationListLoading || organizationUsersListLoading}
            isErrored={organizationListErrored || organizationUsersListErrored}
          >
            <table className="w-100">
              <thead>
                <tr>
                  <th className="px-2 py-1 border-bottom">User</th>
                  <th className="px-2 py-1 border-bottom">Role</th>
                  <th className="px-2 py-1 border-bottom">Email</th>
                  <th className="px-2 py-1 border-bottom">User ID</th>
                  <th className="px-2 py-1 border-bottom"></th>
                </tr>
              </thead>
              <tbody>
                {organizationUsersListResponse?.users.map((user) => (
                  <tr key={user.userId}>
                    <td key={`${user.userId}-name`} className="px-2 py-1 border-bottom">
                      {user.lastName}, {user.firstName}
                    </td>
                    <td key={`${user.userId}-role`} className="px-2 py-1 border-bottom">
                      {RoleDisplayNames[user.role]}
                    </td>
                    <td key={`${user.userId}-email`} className="px-2 py-1 border-bottom">
                      {user.email}
                    </td>
                    <td key={`${user.userId}-userID`} className="px-2 py-1 border-bottom">
                      {user.userName}
                    </td>
                    <td key={`${user.userId}-remove`} className="px-2 py-1 border-bottom text-center">
                      {/* // TODO: JN - get to be link style and red color? */}
                      <Button
                        variant="outline-danger"
                        className="px-3 py-1"
                        onClick={() => console.log(`Remove user ${user.userId}`)}
                      >
                        Remove from Org
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableLoading>
        </div>
      </div>
    </>
  );
}
