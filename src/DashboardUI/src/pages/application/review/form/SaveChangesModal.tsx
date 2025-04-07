import { useState } from 'react';
import Button from 'react-bootstrap/esm/Button';
import Form from 'react-bootstrap/esm/Form';
import Modal from 'react-bootstrap/esm/Modal';

export interface SaveChangesModalProps {
  show: boolean;
  onCancel: () => void;
  onConfirm: (documentedChanges: string) => void;
}

export function SaveChangesModal(props: SaveChangesModalProps) {
  const [documentedChanges, setDocumentedChanges] = useState('');

  const handleConfirmClicked = () => {
    props.onConfirm(documentedChanges);
    setDocumentedChanges('');
  };

  const handleCancelClicked = () => {
    setDocumentedChanges('');
    props.onCancel();
  };

  return (
    <Modal show={props.show} centered>
      <Modal.Header closeButton onClick={props.onCancel}>
        <Modal.Title>Document your Changes</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          To save any modifications to this application, please{' '}
          <strong>record what content you edited or added.</strong> Once submitted, your changes can be seen by you and
          other reviewing users at the bottom of this application.
        </p>

        <Form>
          <Form.Group controlId="documentedChanges">
            <Form.Control
              as="textarea"
              type="text"
              aria-label="Changes"
              maxLength={4000}
              required
              placeholder="Describe any modifications to the document since last save. (Required)"
              defaultValue={documentedChanges}
              onChange={(e) => setDocumentedChanges(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCancelClicked}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleConfirmClicked} disabled={!documentedChanges}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
