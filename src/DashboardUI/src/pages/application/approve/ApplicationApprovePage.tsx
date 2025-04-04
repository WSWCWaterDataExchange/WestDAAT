import { useNavigate, useParams } from 'react-router-dom';
import { NotImplementedPlaceholder } from '../../../components/NotImplementedAlert';
import { ApplicationNavbar } from '../components/ApplicationNavbar';
import { useFundingOrganizationQuery, useGetApplicationQuery } from '../../../hooks/queries/useApplicationQuery';
import { useConservationApplicationContext } from '../../../contexts/ConservationApplicationProvider';
import ApplicationReviewHeader from '../components/ApplicationReviewHeader';
import Alert from 'react-bootstrap/esm/Alert';

export function ApplicationApprovePage() {
  const navigate = useNavigate();
  const { applicationId } = useParams();
  const { state } = useConservationApplicationContext();

  const navigateBack = () => {
    navigate(`/application/organization/dashboard`);
  };

  useGetApplicationQuery(applicationId, 'reviewer', true);
  useFundingOrganizationQuery(state.conservationApplication.waterRightNativeId);

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

              <NotImplementedPlaceholder />
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
