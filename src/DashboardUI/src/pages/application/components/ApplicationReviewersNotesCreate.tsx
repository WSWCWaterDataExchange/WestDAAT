import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/esm/Form';
import { useRef, useState } from 'react';
import { InputGroup } from 'react-bootstrap';
import { Icon } from '@mdi/react';
import { mdiSend } from '@mdi/js';
import { useMutation } from 'react-query';
import { useMsal } from '@azure/msal-react';
import { createApplicationReviewerNote } from '../../../accessors/applicationAccessor';
import { ApplicationReviewNote } from '../../../data-contracts/ApplicationReviewNote';
import { toast } from 'react-toastify';
import { useConservationApplicationContext } from '../../../contexts/ConservationApplicationProvider';

export interface ApplicationReviewersNotesCreateProps {
  applicationId: string;
}

export function ApplicationReviewersNotesCreate() {
  const { state, dispatch } = useConservationApplicationContext();

  const context = useMsal();
  const [validated, setValidated] = useState(false);

  //   const [reviewerNotes, setReviewerNotes] = useState<string | undefined>(undefined);
  const formRef = useRef<HTMLFormElement>(null);
  const notesRef = useRef<HTMLTextAreaElement>(null);

  const createNoteMutation = useMutation({
    mutationFn: async () => {
      const response = await createApplicationReviewerNote(context, {
        applicationId: state.conservationApplication.waterConservationApplicationId!,
        note: notesRef.current?.value!,
      });
      return response.note;
    },
    onSuccess: (note: ApplicationReviewNote) => {
      dispatch({ type: 'APPLICATION_NOTE_ADDED', payload: { note } });
      //   setReviewerNotes(undefined);
    },
    onError: () => {
      toast.error('Error adding application note. Please try again.');
    },
  });

  const handleAddNoteClick = () => {
    // if (!state.conservationApplication.waterConservationApplicationId) {
    //   throw new Error('Application must be loaded in order to submit reviewer notes');
    // }

    // if (!reviewerNotes || reviewerNotes.trim().length === 0) {
    //   throw new Error('Reviewer notes cannot be empty');
    // }
    const isFormValid = formRef.current!.checkValidity();
    setValidated(true);
    console.log(`form validitiy: ${JSON.stringify(formRef.current?.checkValidity())}`);
    if (isFormValid) {
      createNoteMutation.mutate();
      formRef.current?.reset();
      setValidated(false);
    }
  };

  return (
    <>
      {'is Validated? ' + validated}
      <br />
      {'is form valid? ' + formRef.current?.checkValidity()}
      <Form
        noValidate
        ref={formRef}
        validated={validated}
        //   onChange={() => setValidated(false)}
      >
        <Form.Group>
          <InputGroup>
            <Form.Control
              required
              id="application-reviewer-notes"
              placeholder="Type to add a note"
              aria-label="Application Reviewer Notes"
              className="mt-3"
              as="textarea"
              type="text"
              maxLength={4000}
              ref={notesRef}
              //   onChange={(e) => setReviewerNotes(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">A message is required.</Form.Control.Feedback>
            <InputGroup.Text className="py-0">
              <Button
                onClick={handleAddNoteClick}
                disabled={createNoteMutation.isLoading}
                variant="link"
                className="px-1 py-0 text-primary"
                aria-label="Create reviewer note"
              >
                <Icon path={mdiSend} size="1em" />
              </Button>
            </InputGroup.Text>
          </InputGroup>
        </Form.Group>
      </Form>
    </>
  );
}
