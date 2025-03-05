import Modal, { ModalProps } from 'react-bootstrap/Modal';

export interface EditOrganizationUserModalProps extends ModalProps {
  organizationId: string | null | undefined;
  userId: string | null;
  role: string;
  closeModal: () => void;
}

export function EditOrganizationUserModal(props: EditOrganizationUserModalProps) {
  return (
    <Modal show={props.show} id="editUserModal" centered>
      <Modal.Header closeButton onClick={() => props.closeModal()}>
        <Modal.Title>Edit User</Modal.Title>
      </Modal.Header>
    </Modal>
  );
}
