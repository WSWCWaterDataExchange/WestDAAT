import Modal from 'react-bootstrap/esm/Modal';
import { NotImplementedPlaceholder } from '../../../components/NotImplementedAlert';

export interface ApplicationAcceptModalProps {
  show: boolean;
  onCancel: () => void;
}

export function ApplicationAcceptModal(props: ApplicationAcceptModalProps) {
  return (
    <Modal show={props.show} centered>
      <Modal.Header closeButton onClick={props.onCancel}>
        Accept Application
      </Modal.Header>
      <Modal.Body>
        <NotImplementedPlaceholder />
      </Modal.Body>
    </Modal>
  );
}
