import { useMsal } from '@azure/msal-react';
import { mdiSend } from '@mdi/js';
import { Icon } from '@mdi/react';
import { useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import { createApplicationReviewerNote } from '../../../accessors/applicationAccessor';
import { useConservationApplicationContext } from '../../../contexts/ConservationApplicationProvider';
import { ApplicationReviewNote } from '../../../data-contracts/ApplicationReviewNote';

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
    if (!reviewerNotes || reviewerNotes.trim().length === 0 || createNoteMutation.isLoading) {
      return;
    }

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
      <Form ref={formRef} className="p-0">
        <Form.Group>
          <InputGroup className="mb-3 mt-4">
            <Form.Control
              required
              id="application-reviewer-notes"
              placeholder="Type to add a note"
              aria-label="Application Reviewer Notes"
              className="border-end-0 border-secondary-subtle resize-none"
              as="textarea"
              type="text"
              maxLength={4000}
              onChange={(e) => setReviewerNotes(e.target.value)}
            />
            <Button
              variant="outline-primary"
              className="border-start-0 px-3 border-secondary-subtle"
              aria-label="Create new reviewer note"
              onClick={handleAddNoteClick}
            >
              <Icon path={mdiSend} size="1.3em" />
            </Button>
          </InputGroup>
        </Form.Group>
      </Form>
    </>
  );
}
