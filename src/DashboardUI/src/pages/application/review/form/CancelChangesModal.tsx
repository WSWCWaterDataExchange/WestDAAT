import Button from 'react-bootstrap/esm/Button';
import Modal from 'react-bootstrap/esm/Modal';

export interface CancelChangesModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function CancelChangesModal(props: CancelChangesModalProps) {
  return (
    <Modal show={props.show} centered>
      <Modal.Header closeButton onClick={props.onClose}>
        <Modal.Title>You have unsaved changes</Modal.Title>
      </Modal.Header>
      <Modal.Body>Unsaved changes will be lost if you proceed. Do you want to continue?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.onClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={props.onConfirm}>
          Discard Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
