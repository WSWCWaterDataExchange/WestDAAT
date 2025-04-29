import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/esm/Form';
import Modal from 'react-bootstrap/Modal';

export interface ApplicationDenyModalProps {
  show: boolean;
  onCancel: () => void;
  onDeny: (notes: string) => void;
  disableButtons: boolean;
}

export function ApplicationDenyModal(props: ApplicationDenyModalProps) {
  const [approvalNotes, setApprovalNotes] = useState<string | undefined>(undefined);

  const handleCancelClicked = () => {
    props.onCancel();
    setApprovalNotes(undefined);
  };

  const handleDenyClicked = () => {
    if (!approvalNotes || approvalNotes.trim().length === 0) {
      throw new Error('Application approval notes are required.');
    }
    props.onDeny(approvalNotes);
    setApprovalNotes(undefined);
  };

  return (
    <Modal show={props.show} centered>
      <Modal.Header closeButton onClick={props.onCancel}>
        <Modal.Title>Deny this application?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to deny this application? If so, leave a note for the applicant below, then, click DENY.
        The applicant will receive notice of your decision via email with any notes included below.
        <Form>
          <Form.Group>
            <Form.Control
              required
              id="application-approval-deny-notes"
              placeholder="Type a note for the applicant (required)"
              aria-label="Application Denial Notes"
              className="mt-3"
              as="textarea"
              type="text"
              maxLength={4000}
              onChange={(e) => setApprovalNotes(e.target.value)}
            ></Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outlined-secondary" onClick={handleCancelClicked} disabled={props.disableButtons}>
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={handleDenyClicked}
          disabled={!approvalNotes || approvalNotes.trim().length === 0 || props.disableButtons}
        >
          Deny
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
