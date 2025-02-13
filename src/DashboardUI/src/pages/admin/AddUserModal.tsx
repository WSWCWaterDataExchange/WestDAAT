import Button from 'react-bootstrap/esm/Button';
import Modal, { ModalProps } from 'react-bootstrap/esm/Modal';

interface AddUserModalProps extends ModalProps {}

function AddUserModal(props: AddUserModalProps) {
  return (
    <Modal show={props.show} centered>
      <Modal.Header closeButton onClick={props.onHide}>
        <Modal.Title>Add a User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Modal Body</p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Cancel</Button>
        <Button onClick={() => alert('This feature will be implemented in a future release.')}>Add User</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddUserModal;
