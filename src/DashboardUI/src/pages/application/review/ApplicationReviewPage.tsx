import { useNavigate, useParams } from 'react-router-dom';
import { ApplicationNavbar } from '../components/ApplicationNavbar';
import ApplicationSubmissionForm from '../components/ApplicationSubmissionForm';
import { useFundingOrganizationQuery, useGetApplicationQuery } from '../../../hooks/queries/useApplicationQuery';
import { useConservationApplicationContext } from '../../../contexts/ConservationApplicationProvider';
import useDirtyFormCheck from '../../../hooks/useDirtyFormCheck';
import ApplicationReviewHeader from '../components/ApplicationReviewHeader';
import { ApplicationReviewPerspective } from '../../../data-contracts/ApplicationReviewPerspective';
import ApplicationDocumentUploadSection from '../components/ApplicationDocumentUploadSection';
import { useRef, useState } from 'react';
import ApplicationReviewPipelineSection from '../components/ApplicationReviewPipelineSection';
import Button from 'react-bootstrap/esm/Button';
import ConfirmationModal from '../../../components/ConfirmationModal';
import Modal from 'react-bootstrap/esm/Modal';
import Form from 'react-bootstrap/esm/Form';
import { useMutation } from 'react-query';
import { updateApplicationSubmission } from '../../../accessors/applicationAccessor';
import { useMsal } from '@azure/msal-react';
import { toast } from 'react-toastify';
import ApplicationReviewersNotesSection from '../components/ApplicationReviewersNotesSection';

const perspective: ApplicationReviewPerspective = 'reviewer';

function ApplicationReviewPage() {
  const context = useMsal();
  const navigate = useNavigate();
  const { applicationId } = useParams();
  const { state } = useConservationApplicationContext();
  const [showCancelConfirmationModal, setShowCancelConfirmationModal] = useState(false);
  const [showSaveChangesModal, setShowSaveChangesModal] = useState(false);

  const navigateToApplicationOrganizationDashboard = () => {
    navigate(`/application/organization/dashboard`);
  };

  const { isLoading: isApplicationLoading } = useGetApplicationQuery(applicationId, 'reviewer', true);
  const { isLoading: isFundingOrganizationLoading } = useFundingOrganizationQuery(
    state.conservationApplication.waterRightNativeId,
  );

  const isFormDirty = useDirtyFormCheck(state.conservationApplication.applicationSubmissionForm, {
    isEnabled: !isApplicationLoading && !isFundingOrganizationLoading,
  });

  const formRef = useRef<HTMLFormElement>(null);
  const [formValidated, setFormValidated] = useState(false);

  const alertNotImplemented = () => alert('Not implemented. This feature will be implemented in a future release.');

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
    },
    onError: () => {
      toast.error('Error saving application changes.');
    },
  });

  return (
    <div className="d-flex flex-column flex-grow-1 h-100">
      <ApplicationNavbar
        navigateBack={navigateToApplicationOrganizationDashboard}
        backButtonText="Back to Dashboard"
        centerText="Water Conservation Estimation Tool"
      />

      <div className="overflow-y-auto">
        {!isApplicationLoading && !isFundingOrganizationLoading && (
          <div className="container">
            <ApplicationReviewHeader perspective={perspective} />
            <ApplicationSubmissionForm ref={formRef} formValidated={formValidated} />
            <ApplicationDocumentUploadSection perspective={perspective} />
            <ApplicationReviewPipelineSection />
            <ApplicationReviewersNotesSection />
            <ReviewerButtonRow
              isFormDirty={isFormDirty}
              handleCancelClicked={() => setShowCancelConfirmationModal(true)}
              handleSaveClicked={handleSaveClicked}
              handleSubmitForFinalReviewClicked={alertNotImplemented}
            />
          </div>
        )}

        <ConfirmationModal
          show={showCancelConfirmationModal}
          onCancel={() => setShowCancelConfirmationModal(false)}
          onConfirm={navigateToApplicationOrganizationDashboard}
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
      </div>
    </div>
  );
}

export default ApplicationReviewPage;

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
            <Form.Label>Changes</Form.Label>
            <Form.Control
              as="textarea"
              type="text"
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
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
