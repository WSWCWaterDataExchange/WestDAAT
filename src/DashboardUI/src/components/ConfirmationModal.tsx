import Button from 'react-bootstrap/esm/Button';
import Modal from 'react-bootstrap/esm/Modal';

interface ConfirmationModalProps {
  show: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  titleText: string;
  cancelText: string;
  confirmText: string;
  children: React.ReactNode;
  disableActionButtons?: boolean;
}

function ConfirmationModal(props: ConfirmationModalProps) {
  return (
    <Modal show={props.show} centered>
      <Modal.Header closeButton onClick={props.onCancel}>
        <Modal.Title>{props.titleText}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{props.children}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.onCancel} disabled={props.disableActionButtons}>
          {props.cancelText}
        </Button>
        <Button variant="primary" onClick={props.onConfirm} disabled={props.disableActionButtons}>
          {props.confirmText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmationModal;
