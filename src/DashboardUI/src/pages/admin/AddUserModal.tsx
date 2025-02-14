import Button from 'react-bootstrap/esm/Button';
import Modal, { ModalProps } from 'react-bootstrap/esm/Modal';
import { OrganizationSummaryItem } from '../../data-contracts/OrganizationSummaryItem';

interface AddUserModalProps extends ModalProps {
  organization: OrganizationSummaryItem | undefined;
}

function AddUserModal(props: AddUserModalProps) {
  return (
    <Modal show={props.show} centered>
      <Modal.Header>
        <Modal.Title>
          Add a User
          <p className="fs-6 m-0 mt-2">{props.organization?.name}</p>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Modal Body</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.onHide}>
          Cancel
        </Button>
        <Button onClick={() => alert('This feature will be implemented in a future release.')}>Add User</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddUserModal;
