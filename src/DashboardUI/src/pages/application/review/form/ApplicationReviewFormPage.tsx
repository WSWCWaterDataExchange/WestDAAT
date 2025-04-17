import { useMsal } from '@azure/msal-react';
import { useRef, useState } from 'react';
import { useMutation } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { updateApplicationSubmission } from '../../../../accessors/applicationAccessor';
import ConfirmationModal from '../../../../components/ConfirmationModal';
import { useConservationApplicationContext } from '../../../../contexts/ConservationApplicationProvider';
import { ApplicationReviewPerspective } from '../../../../data-contracts/ApplicationReviewPerspective';
import ApplicationDocumentSection from '../../components/ApplicationDocumentSection';
import ApplicationReviewersNotesSection from '../../components/ApplicationReviewersNotesSection';
import ApplicationReviewPipelineSection from '../../components/ApplicationReviewPipelineSection';
import ApplicationSubmissionForm from '../../components/ApplicationSubmissionForm';
import { ApplicationReviewButtonRow } from './ApplicationReviewButtonRow';
import { SaveChangesModal } from './SaveChangesModal';
import { SubmitApplicationRecommendationModal } from './SubmitApplicationRecommendationModal';
import { UnsavedChangesModal } from './UnsavedChangesModal';
import { ApplicationReviewNote } from '../../../../data-contracts/ApplicationReviewNote';
import GenericLoadingForm from '../../../../components/GenericLoadingForm';

const perspective: ApplicationReviewPerspective = 'reviewer';

export function ApplicationReviewFormPage() {
  const msalContext = useMsal();
  const navigate = useNavigate();
  const { applicationId } = useParams();
  const { state, dispatch } = useConservationApplicationContext();

  const isApplicationLoading = state.isLoadingApplication;
  const isFundingOrganizationLoading = state.isLoadingFundingOrganization;

  const [showCancelConfirmationModal, setShowCancelConfirmationModal] = useState(false);
  const [showSaveChangesModal, setShowSaveChangesModal] = useState(false);
  const [showUnsavedChangesModal, setShowUnsavedChangesModal] = useState(false);
  const [showSubmitRecommendationModal, setShowSubmitRecommendationModal] = useState(false);

  const navigateToApplicationOrganizationDashboard = () => {
    navigate(`/application/organization/dashboard`);
  };

  const formRef = useRef<HTMLFormElement>(null);
  const [formValidated, setFormValidated] = useState(false);

  const handleCancelClicked = () => {
    if (state.conservationApplication.isDirty) {
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

  const handleSubmitClicked = () => {
    if (state.conservationApplication.isDirty) {
      setShowUnsavedChangesModal(true);
    } else {
      setShowSubmitRecommendationModal(true);
    }
  };

  const handleSubmitConfirmed = () => {
    setShowSubmitRecommendationModal(false);
    navigateToApplicationOrganizationDashboard();
  };

  const updateApplicationSubmissionMutation = useMutation({
    mutationFn: async (documentedChanges: string) => {
      const response = await updateApplicationSubmission(msalContext, {
        waterConservationApplicationId: applicationId!,
        form: state.conservationApplication.applicationSubmissionForm,
        supportingDocuments: state.conservationApplication.supportingDocuments,
        note: documentedChanges,
      });
      return response.note;
    },
    onSuccess: (note: ApplicationReviewNote) => {
      toast.success('Application changes saved successfully.');
      setShowSaveChangesModal(false);
      dispatch({ type: 'APPLICATION_NOTE_ADDED', payload: { note } });
      dispatch({ type: 'APPLICATION_SAVED' });
    },
    onError: () => {
      toast.error('Error saving application changes.');
      setShowSaveChangesModal(false);
    },
  });

  if (isApplicationLoading || isFundingOrganizationLoading) {
    return (
      <div className="container">
        <GenericLoadingForm />
      </div>
    );
  }

  return (
    <div className="container">
      <ApplicationSubmissionForm perspective={perspective} ref={formRef} formValidated={formValidated} />
      <ApplicationDocumentSection perspective={perspective} readOnly={false} />
      <ApplicationReviewPipelineSection />
      <ApplicationReviewersNotesSection />
      <ApplicationReviewButtonRow
        isFormDirty={state.conservationApplication.isDirty}
        isFormSubmitting={showSubmitRecommendationModal}
        handleCancelClicked={handleCancelClicked}
        handleSaveClicked={handleSaveClicked}
        handleSubmitForFinalReviewClicked={handleSubmitClicked}
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
          await updateApplicationSubmissionMutation.mutate(documentedChanges)
        }
        disableActionButtons={updateApplicationSubmissionMutation.isLoading}
      />
      <UnsavedChangesModal show={showUnsavedChangesModal} onClose={() => setShowUnsavedChangesModal(false)} />
      <SubmitApplicationRecommendationModal
        show={showSubmitRecommendationModal}
        applicationId={applicationId!}
        onClose={() => setShowSubmitRecommendationModal(false)}
        onSuccess={handleSubmitConfirmed}
      ></SubmitApplicationRecommendationModal>
    </div>
  );
}
