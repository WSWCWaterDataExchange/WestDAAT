import { useState } from 'react';
import Alert from 'react-bootstrap/esm/Alert';
import { useMutation } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ApplicationFormSectionRule } from '../../../components/ApplicationFormSectionRule';
import { useConservationApplicationContext } from '../../../contexts/ConservationApplicationProvider';
import { ApprovalDecision } from '../../../data-contracts/ApprovalDecision';
import { useFundingOrganizationQuery, useGetApplicationQuery } from '../../../hooks/queries/useApplicationQuery';
import ApplicationDocumentSection from '../components/ApplicationDocumentSection';
import { ApplicationNavbar } from '../components/ApplicationNavbar';
import ApplicationReviewHeader from '../components/ApplicationReviewHeader';
import ApplicationReviewPipelineSection from '../components/ApplicationReviewPipelineSection';
import ApplicationReviewersNotesSection from '../components/ApplicationReviewersNotesSection';
import ApplicationSubmissionFormDisplay from '../components/ApplicationSubmissionFormDisplay';
import { ApplicationApproveModal } from './ApplicationApproveModal';
import { ApplicationApproveButtonRow } from './ApplicationApproveButtonRow';
import { ApplicationDenyModal } from './ApplicationDenyModal';
import { submitApplicationApproval } from '../../../accessors/applicationAccessor';
import { useMsal } from '@azure/msal-react';
import { ConservationApplicationStatus } from '../../../data-contracts/ConservationApplicationStatus';
import { hasPermission } from '../../../utilities/securityHelpers';
import { Permission } from '../../../roleConfig';
import { useAuthenticationContext } from '../../../hooks/useAuthenticationContext';
import GenericLoadingForm from '../../../components/GenericLoadingForm';

export function ApplicationApprovePage() {
  const context = useMsal();
  const navigate = useNavigate();
  const { applicationId } = useParams();
  const { state } = useConservationApplicationContext();
  const { user } = useAuthenticationContext();

  const navigateBack = () => {
    navigate(`/application/organization/dashboard`);
  };

  const { isLoading: isApplicationLoading } = useGetApplicationQuery(applicationId, 'reviewer', true);
  const { isLoading: isFundingOrganizationLoading } = useFundingOrganizationQuery(
    state.conservationApplication.waterRightNativeId,
  );

  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showDenyModal, setShowDenyModal] = useState(false);

  const isPageLoading = isApplicationLoading || isFundingOrganizationLoading;
  const isModalOpen = showApproveModal || showDenyModal;

  const handleApproveClicked = () => {
    setShowApproveModal(true);
  };

  const handleDenyClicked = () => {
    setShowDenyModal(true);
  };

  const handleApplicationApproved = (approvalNotes: string) => {
    submitApplicationApprovalMutation.mutate({ decision: ApprovalDecision.Approved, notes: approvalNotes });
  };

  const handleApplicationDenied = (approvalNotes: string) => {
    submitApplicationApprovalMutation.mutate({ decision: ApprovalDecision.Denied, notes: approvalNotes });
  };

  const submitApplicationApprovalMutation = useMutation({
    mutationFn: async (approval: { decision: ApprovalDecision; notes: string }) => {
      await submitApplicationApproval(context, {
        waterConservationApplicationId: applicationId!,
        approvalDecision: approval.decision,
        approvalNotes: approval.notes,
      });
      return approval.decision;
    },
    onSuccess: (decision: ApprovalDecision) => {
      let toastMessage = '';

      if (decision === ApprovalDecision.Approved) {
        toastMessage = 'Application approved successfully.';
      }

      if (decision === ApprovalDecision.Denied) {
        toastMessage = 'Application denied successfully.';
      }

      toast.success(toastMessage, {
        autoClose: 1000,
      });

      setShowApproveModal(false);
      setShowDenyModal(false);
      navigateBack();
    },
    onError: (decision: ApprovalDecision) => {
      let toastMessage = '';

      if (decision === ApprovalDecision.Approved) {
        toastMessage = 'Error submitting application approval.';
      }

      if (decision === ApprovalDecision.Denied) {
        toastMessage = 'Error submitting application denial.';
      }

      toast.error(toastMessage, {
        position: 'top-center',
        theme: 'colored',
        autoClose: 3000,
      });
    },
  });

  const navigateToReviewPage = () => {
    const id = state.conservationApplication.waterConservationApplicationId;
    if (id) {
      navigate(`/application/${id}/review`);
    }
  };

  const canUpdateApplication = hasPermission(user, Permission.ApplicationUpdate);
  const canApproveApplication = hasPermission(user, Permission.ApplicationApprove);

  const isApplicationInFinalReview =
    state.conservationApplication.status === ConservationApplicationStatus.InFinalReview;

  const isApplicationFinalized =
    state.conservationApplication.status === ConservationApplicationStatus.Unknown ||
    state.conservationApplication.status === ConservationApplicationStatus.Approved ||
    state.conservationApplication.status === ConservationApplicationStatus.Denied;

  return (
    <div className="d-flex flex-column flex-grow-1 h-100">
      <ApplicationNavbar
        navigateBack={navigateBack}
        backButtonText="Back to Dashboard"
        centerText="Application Review"
        centerTextIsLoading={false}
        displayWaterIcon={false}
        rightButtonDisplayed={canUpdateApplication && !isApplicationFinalized && !isPageLoading}
        rightButtonText="Edit Application"
        onRightButtonClick={navigateToReviewPage}
      />
      <div className="overflow-y-auto">
        {!state.loadApplicationErrored && !state.loadFundingOrganizationErrored && (
          <>
            <div className="container">
              <ApplicationReviewHeader />
              {isApplicationLoading || isFundingOrganizationLoading ? (
                <GenericLoadingForm />
              ) : (
                <>
                  <ApplicationSubmissionFormDisplay />
                  <ApplicationDocumentSection readOnly={true} perspective={'reviewer'} />
                  <ApplicationReviewPipelineSection />
                  <ApplicationReviewersNotesSection />
                  <ApplicationFormSectionRule width={1} />
                  <ApplicationApproveButtonRow
                    isHidden={!canApproveApplication || !isApplicationInFinalReview}
                    disableButtons={isPageLoading || isModalOpen || submitApplicationApprovalMutation.isLoading}
                    handleApproveClicked={handleApproveClicked}
                    handleDenyClicked={handleDenyClicked}
                  />
                </>
              )}
            </div>
          </>
        )}

        {(state.loadApplicationErrored || state.loadFundingOrganizationErrored) && (
          <div className="container mt-3">
            <Alert variant="danger" className="text-center">
              Failed to load Application data. Please try again later.
            </Alert>
          </div>
        )}

        <ApplicationApproveModal
          show={showApproveModal}
          onCancel={() => setShowApproveModal(false)}
          onApprove={handleApplicationApproved}
          disableButtons={submitApplicationApprovalMutation.isLoading}
        />
        <ApplicationDenyModal
          show={showDenyModal}
          onCancel={() => setShowDenyModal(false)}
          onDeny={handleApplicationDenied}
          disableButtons={submitApplicationApprovalMutation.isLoading}
        />
      </div>
    </div>
  );
}
