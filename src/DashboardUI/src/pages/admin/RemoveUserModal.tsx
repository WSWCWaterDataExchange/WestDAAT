import Modal, { ModalProps } from 'react-bootstrap/Modal';
import { NotImplementedPlaceholder } from '../../components/NotImplementedAlert';
import { useMutation } from 'react-query';
import { removeOrganizationMember } from '../../accessors/organizationAccessor';
import { useMsal } from '@azure/msal-react';
import Button from 'react-bootstrap/esm/Button';

export interface RemoveOrganizationUserModalProps extends ModalProps {
  organizationId: string | null | undefined;
  userId: string | null;
  closeModal: () => void;
}

export function RemoveOrganizationUserModal(props: RemoveOrganizationUserModalProps) {
  const msalContext = useMsal();

  const removeOrganizationMemberMutation = useMutation({
    mutationFn: async (params: { organizationId: string; userId: string }) => {
      return await removeOrganizationMember(msalContext, params.organizationId, params.userId);
    },
    onSuccess: () => {
      console.log('inside remove organization member onSuccess');
      // trigger success toast notification
      // remove the user from the query cache
      // close the modal
    },
    onError: () => {
      console.log('inside remove organization member onError');
      // trigger error toast notification
      // (keep the modal open)
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
      <Modal.Body>
        <NotImplementedPlaceholder />
        <Button onClick={handleRemoveUserClick}>Remove</Button>
      </Modal.Body>
    </Modal>
  );
}
