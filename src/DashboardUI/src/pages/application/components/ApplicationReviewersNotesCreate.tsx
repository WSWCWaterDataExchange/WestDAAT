import { useRef, useState } from 'react';
import { Icon } from '@mdi/react';
import { mdiSend } from '@mdi/js';
import { useMutation } from 'react-query';
import { useMsal } from '@azure/msal-react';
import { createApplicationReviewerNote } from '../../../accessors/applicationAccessor';
import { ApplicationReviewNote } from '../../../data-contracts/ApplicationReviewNote';
import { toast } from 'react-toastify';
import { useConservationApplicationContext } from '../../../contexts/ConservationApplicationProvider';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

export interface ApplicationReviewersNotesCreateProps {
  applicationId: string;
}

export function ApplicationReviewersNotesCreate() {
  const context = useMsal();
  const { state, dispatch } = useConservationApplicationContext();
  const [reviewerNotes, setReviewerNotes] = useState<string | undefined>(undefined);
  const formRef = useRef<HTMLFormElement>(null);

  const createNoteMutation = useMutation({
    mutationFn: async () => {
      const response = await createApplicationReviewerNote(context, {
        applicationId: state.conservationApplication.waterConservationApplicationId!,
        note: reviewerNotes!,
      });
      return response.note;
    },
    onSuccess: (note: ApplicationReviewNote) => {
      dispatch({ type: 'APPLICATION_NOTE_ADDED', payload: { note } });
      setReviewerNotes(undefined);
      formRef.current?.reset();
    },
    onError: () => {
      toast.error('Error adding application note. Please try again.');
    },
  });

  const handleAddNoteClick = () => {
    if (!state.conservationApplication.waterConservationApplicationId) {
      throw new Error('Application must be loaded in order to submit reviewer notes');
    }

    if (!reviewerNotes || reviewerNotes.trim().length === 0) {
      throw new Error('Reviewer notes cannot be empty');
    }

    createNoteMutation.mutate();
  };

  return (
    <>
      <Form ref={formRef}>
        <Form.Group>
          <InputGroup className="mb-3">
            <Form.Control
              required
              id="application-reviewer-notes"
              placeholder="Type to add a note"
              aria-label="Application Reviewer Notes"
              className="mt-3 border-end-0 border-secondary-subtle"
              as="textarea"
              type="text"
              maxLength={4000}
              onChange={(e) => setReviewerNotes(e.target.value)}
            />
            <Button
              variant="outline-primary"
              className="border-start-0 mt-3 border-secondary-subtle"
              aria-label="Create new reviewer note"
              disabled={!reviewerNotes || reviewerNotes.trim().length === 0 || createNoteMutation.isLoading}
              onClick={handleAddNoteClick}
            >
              <Icon path={mdiSend} size="1em" />
            </Button>
          </InputGroup>
        </Form.Group>
      </Form>
    </>
  );
}
