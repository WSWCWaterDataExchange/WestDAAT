import { useMsal } from '@azure/msal-react';
import { useRef } from 'react';
import Button from 'react-bootstrap/esm/Button';
import Form from 'react-bootstrap/esm/Form';
import Modal, { ModalProps } from 'react-bootstrap/Modal';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { editOrganizationMember } from '../../accessors/organizationAccessor';
import { Role, RoleDisplayNames } from '../../config/role';
import { UserListResponse } from '../../data-contracts/UserListResponse';
import { UserListResult } from '../../data-contracts/UserListResult';

export interface EditOrganizationUserModalProps extends ModalProps {
  organizationId: string | null | undefined;
  userId: string | null;
  closeModal: () => void;
}

export function EditOrganizationUserModal(props: EditOrganizationUserModalProps) {
  const roleOptions = [
    { value: Role.Member, label: RoleDisplayNames[Role.Member] },
    { value: Role.TechnicalReviewer, label: RoleDisplayNames[Role.TechnicalReviewer] },
    { value: Role.OrganizationAdmin, label: RoleDisplayNames[Role.OrganizationAdmin] },
  ];
  const roleRef = useRef<HTMLSelectElement>(null);

  const msalContext = useMsal();
  const queryClient = useQueryClient();
  const user = queryClient
    .getQueryData<UserListResponse>(['organizationUsers', props.organizationId])
    ?.users.find((user) => user.userId === props.userId);

  const editOrganizationMemberMutation = useMutation({
    mutationFn: async (params: { organizationId: string; userId: string; role: string }) => {
      return await editOrganizationMember(msalContext, params.organizationId, params.userId, params.role);
    },
    onSuccess: () => {
      toast.success('User successfully updated', {
        autoClose: 1000,
      });
      // TODO: JN - do I need to re-get the list of users here? could it have changed since the component was mounted?
      const usersList = queryClient.getQueryData<UserListResponse>(['organizationUsers', props.organizationId]); // ?? []
      const editedUserIndex = usersList?.users.findIndex((user: UserListResult) => user.userId === props.userId);

      // TODO: JN - how to handle all these pesky "possibly" undefineds? if statement or ! overrides?
      if (usersList && editedUserIndex !== undefined && roleRef.current) {
        usersList.users[editedUserIndex].role = roleRef.current.value as Role;
        queryClient.setQueryData(['organizationUsers', props.organizationId], usersList);
      }
      props.closeModal();
    },
    onError: () => {
      toast.error('Error saving changes to user', {
        position: 'top-center',
        theme: 'colored',
        autoClose: 3000,
      });
    },
  });

  const handleSaveChangesClick = () => {
    if (!props.organizationId || !props.userId) {
      return;
    }

    if (roleRef.current?.value && roleRef.current.value !== user?.role) {
      editOrganizationMemberMutation.mutate({
        organizationId: props.organizationId,
        userId: props.userId,
        role: roleRef.current?.value,
      });
    } else {
      props.closeModal();
    }
  };

  return (
    <Modal show={props.show} id="editUserModal" centered>
      <Modal.Header closeButton onClick={() => props.closeModal()}>
        <Modal.Title>Edit User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex fs-6 m-0 my-2">
          <div className="fw-bold">{`${user?.firstName} ${user?.lastName}`}</div>
          <div className="px-3">{user?.userName}</div>
        </div>
        <Form>
          <Form.Select ref={roleRef} disabled={editOrganizationMemberMutation.isLoading} defaultValue={user?.role}>
            {roleOptions.map((role) => {
              return (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              );
            })}
          </Form.Select>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => props.closeModal()}
          disabled={editOrganizationMemberMutation.isLoading}
        >
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSaveChangesClick} disabled={editOrganizationMemberMutation.isLoading}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
