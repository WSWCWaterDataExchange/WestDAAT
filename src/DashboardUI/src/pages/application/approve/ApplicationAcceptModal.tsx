import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/esm/Form';
import Modal from 'react-bootstrap/Modal';

export interface ApplicationAcceptModalProps {
  show: boolean;
  onCancel: () => void;
  onAccept: (notes: string) => void;
  disableButtons: boolean;
}

export function ApplicationAcceptModal(props: ApplicationAcceptModalProps) {
  const [approvalNotes, setApprovalNotes] = useState<string | undefined>(undefined);

  const handleCancelClicked = () => {
    props.onCancel();
    setApprovalNotes(undefined);
  };

  const handleAcceptClicked = () => {
    if (!approvalNotes || approvalNotes.trim().length === 0) {
      throw new Error('Application approval notes are required.');
    }
    props.onAccept(approvalNotes);
    setApprovalNotes(undefined);
  };

  return (
    <Modal show={props.show} centered>
      <Modal.Header closeButton onClick={props.onCancel}>
        <Modal.Title>Accept this application?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to accept this application? If so, leave a note for the applicant below, then, click
        ACCEPT. The applicant will receive notice of your decision via email with any notes included below.
        <Form>
          <Form.Group>
            <Form.Control
              required
              id="application-approval-accept-notes"
              placeholder="Type a note for the applicant (required)"
              aria-label="Application Acceptance Notes"
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
          variant="primary"
          onClick={handleAcceptClicked}
          disabled={!approvalNotes || approvalNotes?.trim().length === 0 || props.disableButtons}
        >
          Accept
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
