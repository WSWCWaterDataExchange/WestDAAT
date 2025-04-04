import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ApplicationNavbar } from '../components/ApplicationNavbar';
import ApplicationReviewHeader from '../components/ApplicationReviewHeader';
import { useMemo } from 'react';
import { useFundingOrganizationQuery, useGetApplicationQuery } from '../../../hooks/queries/useApplicationQuery';
import { useConservationApplicationContext } from '../../../contexts/ConservationApplicationProvider';
import Alert from 'react-bootstrap/esm/Alert';

function ApplicationReviewPage() {
  const navigate = useNavigate();
  const { applicationId } = useParams();
  const location = useLocation();
  const { state } = useConservationApplicationContext();

  const isOnMapPage = location.pathname.includes('map');

  const navigateBack = () => {
    if (isOnMapPage) {
      navigate('.'); // navigate up one level
    } else {
      navigate(`/application/organization/dashboard`);
    }
  };

  const backButtonText: string = useMemo(() => {
    return isOnMapPage ? 'Back to Application' : 'Back to Dashboard';
  }, [isOnMapPage]);

  useGetApplicationQuery(applicationId, 'reviewer', true);
  useFundingOrganizationQuery(state.conservationApplication.waterRightNativeId);

  return (
    <div className="d-flex flex-column flex-grow-1 h-100">
      <ApplicationNavbar
        navigateBack={navigateBack}
        backButtonText={backButtonText}
        centerText="Application Review"
        centerTextIsLoading={false}
        displayWaterIcon={false}
      />

      <div className="overflow-y-auto">
        {!state.isLoadingApplication &&
          !state.isLoadingFundingOrganization &&
          !state.loadApplicationErrored &&
          !state.loadFundingOrganizationErrored && (
            <>
              <div className="container">
                <ApplicationReviewHeader />
              </div>

              <Outlet />
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

export default ApplicationReviewPage;
