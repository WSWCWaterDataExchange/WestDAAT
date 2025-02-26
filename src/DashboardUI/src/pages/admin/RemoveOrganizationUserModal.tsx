import Modal, { ModalProps } from 'react-bootstrap/Modal';
import { NotImplementedPlaceholder } from '../../components/NotImplementedAlert';

export interface RemoveOrganizationUserModalProps extends ModalProps {
  userId: string;
  closeModal: () => void;
}

export function RemoveOrganizationUserModal(props: RemoveOrganizationUserModalProps) {
  return (
    <Modal show={props.show} id="removeUserModal" centered>
      <Modal.Header closeButton onClick={() => props.closeModal()}>
        <Modal.Title>Remove User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <NotImplementedPlaceholder />
        User id: {props.userId}
      </Modal.Body>
    </Modal>
  );
}
