import Button from 'react-bootstrap/esm/Button';
import Modal from 'react-bootstrap/esm/Modal';

export interface UnsavedChangesModalProps {
  show: boolean;
  onClose: () => void;
}

export function UnsavedChangesModal(props: UnsavedChangesModalProps) {
  return (
    <Modal show={props.show} centered>
      <Modal.Header closeButton onClick={props.onClose}>
        <Modal.Title>Unsaved Changes</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        You have unsaved changes on this page. Please save and document your changes before submitting the application
        for Final Review.
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={props.onClose}>
          Okay
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
