import { useMsal } from '@azure/msal-react';
import { useState } from 'react';
import Button from 'react-bootstrap/esm/Button';
import { useMutation } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { submitApplication } from '../../../accessors/applicationAccessor';
import { ApplicationFormSectionRule } from '../../../components/ApplicationFormSectionRule';
import ConfirmationModal from '../../../components/ConfirmationModal';
import { useConservationApplicationContext } from '../../../contexts/ConservationApplicationProvider';
import { useFundingOrganizationQuery, useGetApplicationQuery } from '../../../hooks/queries/useApplicationQuery';
import ApplicationDocumentSection from '../components/ApplicationDocumentSection';
import { ApplicationNavbar } from '../components/ApplicationNavbar';
import ApplicationReviewHeader from '../components/ApplicationReviewHeader';
import ApplicationSubmissionFormDisplay from '../components/ApplicationSubmissionFormDisplay';

export function ApplicationSubmitPage() {
  const { state } = useConservationApplicationContext();
  const [showSubmissionConfirmationModal, setShowSubmissionConfirmationModal] = useState(false);
  const navigate = useNavigate();
  const context = useMsal();
  const { applicationId } = useParams();

  const { isLoading: isApplicationLoading } = useGetApplicationQuery(
    applicationId,
    'applicant',
    !state.isCreatingApplication,
  );
  const { isLoading: isFundingOrganizationLoading } = useFundingOrganizationQuery(
    state.conservationApplication.waterRightNativeId,
  );

  const navigateBack = () => {
    if (state.isCreatingApplication) {
      navigate(`/application/${state.conservationApplication.waterConservationApplicationId}/create`);
    } else {
      navigateToWaterRightLandingPage();
    }
  };

  const navigateToWaterRightLandingPage = () => {
    navigate(`/details/right/${state.conservationApplication.waterRightNativeId}`);
  };

  const presentConfirmationModal = () => {
    setShowSubmissionConfirmationModal(true);
  };

  const submitApplicationMutation = useMutation({
    mutationFn: async () => {
      return await submitApplication(context, {
        waterConservationApplicationId: state.conservationApplication.waterConservationApplicationId!,
        waterRightNativeId: state.conservationApplication.waterRightNativeId!,
        form: state.conservationApplication.applicationSubmissionForm,
        supportingDocuments: state.conservationApplication.supportingDocuments,
      });
    },
    onSuccess: () => {
      navigateToWaterRightLandingPage();

      // the notification doesn't appear unless it's delayed until after navigation
      setTimeout(() => {
        toast.success('Application submitted successfully.');
      }, 1);
    },
    onError: (error) => {
      toast.error('Failed to submit application. Please try again.');
    },
  });

  const handleModalCancel = () => {
    setShowSubmissionConfirmationModal(false);
  };

  const handleModalConfirm = async () => {
    await submitApplicationMutation.mutate();
  };

  return (
    <div className="d-flex flex-column flex-grow-1 h-100">
      <ApplicationNavbar
        navigateBack={navigateBack}
        backButtonText={state.isCreatingApplication ? 'Back to Application' : 'Back'}
        centerText={`Application for Water Right Native ID: ${state.conservationApplication.waterRightNativeId}`}
        centerTextIsLoading={isApplicationLoading || isFundingOrganizationLoading}
        displayWaterIcon={false}
      />

      <div className="overflow-y-auto">
        <div className="container">
          <ApplicationReviewHeader />
          <ApplicationSubmissionFormDisplay isLoading={isApplicationLoading || isFundingOrganizationLoading} />
          <ApplicationDocumentSection readOnly={true} />

          {state.isCreatingApplication && (
            <>
              <ApplicationFormSectionRule width={2} />

              <div className="d-flex justify-content-end p-3">
                <Button variant="success" type="button" onClick={presentConfirmationModal}>
                  Submit
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      <ConfirmationModal
        show={showSubmissionConfirmationModal}
        onCancel={handleModalCancel}
        onConfirm={handleModalConfirm}
        titleText="Submit for Review?"
        cancelText="Cancel"
        confirmText="Submit"
        disableActionButtons={submitApplicationMutation.isLoading}
      >
        <div className="mb-2">
          Are you sure you want to submit this application? Once submitted, the application cannot be edited or resent.
        </div>

        <div className="mb-2">The following organizations will be able to see your application:</div>

        <div>
          <ol>
            <li>Conservation Organization</li>
            <li>Technical Reviewer</li>
            <li>WestDAAT Admin (View Only)</li>
            <li>Copy to You</li>
          </ol>
        </div>

        <div>By submitting this application, I hereby declare that the information provided is true and correct</div>
      </ConfirmationModal>
    </div>
  );
}
