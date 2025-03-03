import { useMsal } from '@azure/msal-react';
import Button from 'react-bootstrap/esm/Button';
import Modal, { ModalProps } from 'react-bootstrap/Modal';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { removeOrganizationMember } from '../../accessors/organizationAccessor';
import { UserListResponse } from '../../data-contracts/UserListResponse';
import { UserListResult } from '../../data-contracts/UserListResult';

export interface RemoveOrganizationUserModalProps extends ModalProps {
  organizationId: string | null | undefined;
  userId: string | null;
  closeModal: () => void;
}

export function RemoveOrganizationUserModal(props: RemoveOrganizationUserModalProps) {
  const msalContext = useMsal();
  const queryClient = useQueryClient();
  const user = queryClient
    .getQueryData<UserListResponse>(['organizationUsers', props.organizationId])
    ?.users.find((user) => user.userId === props.userId);

  const removeOrganizationMemberMutation = useMutation({
    mutationFn: async (params: { organizationId: string; userId: string }) => {
      return await removeOrganizationMember(msalContext, params.organizationId, params.userId);
    },
    onSuccess: () => {
      toast.success('User removed from organization', {
        autoClose: 1000,
      });
      const previousUsers = queryClient.getQueryData<UserListResponse>(['organizationUsers', props.organizationId]);
      const updatedUsers = previousUsers?.users.filter((user: UserListResult) => user.userId !== props.userId);
      queryClient.setQueryData(['organizationUsers', props.organizationId], { users: updatedUsers });
      props.closeModal();
    },
    onError: (error: { status?: number }) => {
      if (error?.status === 400) {
        toast.error('You cannot remove yourself from an organization', {
          position: 'top-center',
          theme: 'colored',
          autoClose: 3000,
        });
      } else {
        toast.error('Error removing user from organization', {
          position: 'top-center',
          theme: 'colored',
          autoClose: 3000,
        });
      }
    },
  });

  const handleRemoveUserClick = () => {
    if (!props.organizationId || !props.userId) {
      // TODO: JN - error toast if no organizationId or userId? shouldn't ever be possible
      return;
    }

    removeOrganizationMemberMutation.mutate({
      organizationId: props.organizationId,
      userId: props.userId,
    });
  };

  return (
    <Modal show={props.show} id="removeUserModal" centered>
      <Modal.Header closeButton onClick={() => props.closeModal()}>
        <Modal.Title>Remove User</Modal.Title>
      </Modal.Header>
      <Modal.Body>{`Are you sure you want to remove ${user ? `${user.firstName} ${user.lastName}` : 'this user'} from this organization?`}</Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => props.closeModal()}
          disabled={removeOrganizationMemberMutation.isLoading}
        >
          Cancel
        </Button>
        <Button variant="danger" onClick={handleRemoveUserClick} disabled={removeOrganizationMemberMutation.isLoading}>
          Remove
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
