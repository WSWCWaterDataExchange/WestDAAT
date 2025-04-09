import Modal from 'react-bootstrap/esm/Modal';
import { NotImplementedPlaceholder } from '../../../components/NotImplementedAlert';

export interface ApplicationDenyModalProps {
  show: boolean;
  onCancel: () => void;
}

export function ApplicationDenyModal(props: ApplicationDenyModalProps) {
  return (
    <Modal show={props.show} centered>
      <Modal.Header closeButton onClick={props.onCancel}>
        Deny Application
      </Modal.Header>
      <Modal.Body>
        <NotImplementedPlaceholder />
      </Modal.Body>
    </Modal>
  );
}
