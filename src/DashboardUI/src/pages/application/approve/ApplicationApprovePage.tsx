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
import { ApplicationAcceptModal } from './ApplicationAcceptModal';
import { ApplicationApproveButtonRow } from './ApplicationApproveButtonRow';
import { ApplicationDenyModal } from './ApplicationDenyModal';
import { submitApplicationApproval } from '../../../accessors/applicationAccessor';
import { useMsal } from '@azure/msal-react';

export function ApplicationApprovePage() {
  const context = useMsal();
  const navigate = useNavigate();
  const { applicationId } = useParams();
  const { state } = useConservationApplicationContext();

  const navigateBack = () => {
    navigate(`/application/organization/dashboard`);
  };

  const { isLoading: isApplicationLoading } = useGetApplicationQuery(applicationId, 'reviewer', true);
  const { isLoading: isFundingOrganizationLoading } = useFundingOrganizationQuery(
    state.conservationApplication.waterRightNativeId,
  );

  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showDenyModal, setShowDenyModal] = useState(false);

  const isPageLoading = isApplicationLoading || isFundingOrganizationLoading;
  const isModalOpen = showAcceptModal || showDenyModal;

  const handleAcceptClicked = () => {
    setShowAcceptModal(true);
  };

  const handleDenyClicked = () => {
    setShowDenyModal(true);
  };

  const handleApplicationAccepted = (approvalNotes: string) => {
    submitApplicationApprovalMutation.mutate({ decision: ApprovalDecision.Accepted, notes: approvalNotes });
  };

  const handleApplicationDenied = (approvalNotes: string) => {
    submitApplicationApprovalMutation.mutate({ decision: ApprovalDecision.Rejected, notes: approvalNotes });
  };

  const submitApplicationApprovalMutation = useMutation({
    mutationFn: async (approval: { decision: ApprovalDecision; notes: string }) => {
      await submitApplicationApproval(context, {
        waterConservationApplicationId: applicationId!,
        approvalDecision: approval.decision,
        approvalNotes: approval.notes,
      });
    },
    onSuccess: () => {
      toast.success('Application approval decision submitted successfully.', {
        autoClose: 1000,
      });
      setShowAcceptModal(false);
      setShowDenyModal(false);
      navigateBack();
    },
    onError: () => {
      toast.error('Error submitting application approval decision.', {
        position: 'top-center',
        theme: 'colored',
        autoClose: 3000,
      });
    },
  });

  return (
    <div className="d-flex flex-column flex-grow-1 h-100">
      <ApplicationNavbar
        navigateBack={navigateBack}
        backButtonText="Back to Dashboard"
        centerText="Application Review"
        centerTextIsLoading={false}
        displayWaterIcon={false}
      />
      <div className="overflow-y-auto">
        {!state.loadApplicationErrored && !state.loadFundingOrganizationErrored && (
          <>
            <div className="container">
              <ApplicationReviewHeader />
              <ApplicationSubmissionFormDisplay isLoading={isApplicationLoading || isFundingOrganizationLoading} />
              <ApplicationDocumentSection readOnly={true} />
              <ApplicationReviewPipelineSection />
              <ApplicationReviewersNotesSection />
              <ApplicationFormSectionRule width={1} />
              <ApplicationApproveButtonRow
                disableButtons={isPageLoading || isModalOpen}
                handleAcceptClicked={handleAcceptClicked}
                handleDenyClicked={handleDenyClicked}
              />
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

        <ApplicationAcceptModal
          show={showAcceptModal}
          onCancel={() => setShowAcceptModal(false)}
          onAccept={handleApplicationAccepted}
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
