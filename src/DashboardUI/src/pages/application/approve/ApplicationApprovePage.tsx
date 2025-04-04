import Alert from 'react-bootstrap/esm/Alert';
import { useNavigate, useParams } from 'react-router-dom';
import { useConservationApplicationContext } from '../../../contexts/ConservationApplicationProvider';
import { useFundingOrganizationQuery, useGetApplicationQuery } from '../../../hooks/queries/useApplicationQuery';
import ApplicationDocumentSection from '../components/ApplicationDocumentSection';
import { ApplicationNavbar } from '../components/ApplicationNavbar';
import ApplicationReviewHeader from '../components/ApplicationReviewHeader';
import ApplicationReviewPipelineSection from '../components/ApplicationReviewPipelineSection';
import ApplicationReviewersNotesSection from '../components/ApplicationReviewersNotesSection';
import ApplicationSubmissionFormDisplay from '../components/ApplicationSubmissionFormDisplay';

export function ApplicationApprovePage() {
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
      </div>
    </div>
  );
}
