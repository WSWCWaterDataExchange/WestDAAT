import { useRef, useState } from 'react';
import ApplicationDocumentSection from '../../components/ApplicationDocumentSection';
import ApplicationReviewersNotesSection from '../../components/ApplicationReviewersNotesSection';
import ApplicationReviewPipelineSection from '../../components/ApplicationReviewPipelineSection';
import ApplicationSubmissionForm from '../../components/ApplicationSubmissionForm';
import { useNavigate, useParams } from 'react-router-dom';
import useDirtyFormCheck from '../../../../hooks/useDirtyFormCheck';
import { useConservationApplicationContext } from '../../../../contexts/ConservationApplicationProvider';
import ConfirmationModal from '../../../../components/ConfirmationModal';
import Button from 'react-bootstrap/esm/Button';
import Modal from 'react-bootstrap/esm/Modal';
import Form from 'react-bootstrap/esm/Form';
import { useMutation } from 'react-query';
import { updateApplicationSubmission } from '../../../../accessors/applicationAccessor';
import { useMsal } from '@azure/msal-react';
import { toast } from 'react-toastify';
import { useApplicationReviewPageContext } from '../Provider';

export function ApplicationReviewFormPage() {
  const pageState = useApplicationReviewPageContext();
  const isApplicationLoading = pageState.getApplicationQuery.isLoading;
  const isFundingOrganizationLoading = pageState.getFundingOrganizationQuery.isLoading;

  const context = useMsal();
  const navigate = useNavigate();
  const { applicationId } = useParams();
  const { state } = useConservationApplicationContext();

  const [showCancelConfirmationModal, setShowCancelConfirmationModal] = useState(false);
  const [showSaveChangesModal, setShowSaveChangesModal] = useState(false);

  const navigateToApplicationOrganizationDashboard = () => {
    navigate(`/application/organization/dashboard`);
  };

  const formRef = useRef<HTMLFormElement>(null);
  const [formValidated, setFormValidated] = useState(false);

  const isFormDirty = useDirtyFormCheck(state.conservationApplication.applicationSubmissionForm, {
    isEnabled: !isApplicationLoading && !isFundingOrganizationLoading,
  });

  const alertNotImplemented = () => alert('Not implemented. This feature will be implemented in a future release.');

  const handleCancelClicked = () => {
    if (isFormDirty) {
      setShowCancelConfirmationModal(true);
    } else {
      handleCancelConfirmed();
    }
  };

  const handleCancelConfirmed = () => {
    navigateToApplicationOrganizationDashboard();
  };

  const handleSaveClicked = () => {
    const form = formRef.current;
    const isFormValid = form!.checkValidity();
    setFormValidated(true);

    if (isFormValid) {
      setShowSaveChangesModal(true);
    }
  };

  const updateApplicationSubmissionMutation = useMutation({
    mutationFn: async (documentedChanges: string) => {
      return await updateApplicationSubmission(context, {
        waterConservationApplicationId: applicationId!,
        form: state.conservationApplication.applicationSubmissionForm,
        supportingDocuments: state.conservationApplication.supportingDocuments,
        note: documentedChanges,
      });
    },
    onSuccess: () => {
      toast.success('Application changes saved successfully.');
      setShowSaveChangesModal(false);
    },
    onError: () => {
      toast.error('Error saving application changes.');
      setShowSaveChangesModal(false);
    },
  });

  return (
    <>
      <ApplicationSubmissionForm ref={formRef} formValidated={formValidated} />
      <ApplicationDocumentSection readOnly={false} />
      <ApplicationReviewPipelineSection />
      <ApplicationReviewersNotesSection />
      <ReviewerButtonRow
        isFormDirty={isFormDirty}
        handleCancelClicked={handleCancelClicked}
        handleSaveClicked={handleSaveClicked}
        handleSubmitForFinalReviewClicked={alertNotImplemented}
      />

      <ConfirmationModal
        show={showCancelConfirmationModal}
        onCancel={() => setShowCancelConfirmationModal(false)}
        onConfirm={handleCancelConfirmed}
        titleText="Are you sure you want to leave?"
        cancelText="Cancel"
        confirmText="Okay"
      >
        Any changes to this application will not be saved.
      </ConfirmationModal>

      <SaveChangesModal
        show={showSaveChangesModal}
        onCancel={() => setShowSaveChangesModal(false)}
        onConfirm={async (documentedChanges: string) =>
          await updateApplicationSubmissionMutation.mutateAsync(documentedChanges)
        }
      />
    </>
  );
}

interface ReviewerButtonRowProps {
  isFormDirty: boolean;
  handleCancelClicked: () => void;
  handleSaveClicked: () => void;
  handleSubmitForFinalReviewClicked: () => void;
}

function ReviewerButtonRow(props: ReviewerButtonRowProps) {
  const { isFormDirty, handleCancelClicked, handleSaveClicked, handleSubmitForFinalReviewClicked } = props;
  const { state } = useConservationApplicationContext();

  return (
    <div className="d-flex justify-content-between p-3">
      <div>
        <Button variant="secondary" onClick={handleCancelClicked}>
          Cancel
        </Button>
      </div>

      <div className="d-flex gap-3">
        <Button
          variant="outline-success"
          onClick={handleSaveClicked}
          disabled={state.isUploadingDocument || !isFormDirty}
        >
          Save Changes
        </Button>

        <Button variant="success" onClick={handleSubmitForFinalReviewClicked} disabled={state.isUploadingDocument}>
          Submit for Final Review
        </Button>
      </div>
    </div>
  );
}

interface SaveChangesModalProps {
  show: boolean;
  onCancel: () => void;
  onConfirm: (documentedChanges: string) => void;
}

function SaveChangesModal(props: SaveChangesModalProps) {
  const [documentedChanges, setDocumentedChanges] = useState('');

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
        <Button variant="secondary" onClick={props.onCancel}>
          Cancel
        </Button>
        <Button variant="primary" onClick={() => props.onConfirm(documentedChanges)} disabled={!documentedChanges}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
