import { useMemo } from 'react';
import Alert from 'react-bootstrap/esm/Alert';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useConservationApplicationContext } from '../../../contexts/ConservationApplicationProvider';
import {
  useFundingOrganizationQuery,
  useGetApplicationQuery,
  useReviewerEstimateConsumptiveUseMutation,
} from '../../../hooks/queries/useApplicationQuery';
import { ApplicationNavbar } from '../components/ApplicationNavbar';
import ApplicationReviewHeader from '../components/ApplicationReviewHeader';
import { useAuthenticationContext } from '../../../hooks/useAuthenticationContext';
import { hasPermission } from '../../../utilities/securityHelpers';
import { Permission } from '../../../roleConfig';
import { mdiArrowRight } from '@mdi/js';

function ApplicationReviewPage() {
  const navigate = useNavigate();
  const { applicationId } = useParams();
  const location = useLocation();
  const { state } = useConservationApplicationContext();
  const { user } = useAuthenticationContext();

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

  const rightButtonText: string = useMemo(() => {
    return isOnMapPage ? 'Save Updated Estimate' : 'Continue to Final Approval';
  }, [isOnMapPage]);

  useGetApplicationQuery(applicationId, 'reviewer', true);
  useFundingOrganizationQuery(state.conservationApplication.waterRightNativeId);

  const canApproveApplication = hasPermission(user, Permission.ApplicationApprove);

  const rightButtonDisplayed = useMemo(() => {
    return isOnMapPage ? true : canApproveApplication;
  }, [isOnMapPage, state.canEstimateConsumptiveUse, canApproveApplication]);

  const navigateToApprovalPage = () => {
    const id = state.conservationApplication.waterConservationApplicationId;
    if (id) {
      navigate(`/application/${id}/approve`);
    }
  };

  const reviewerEstimateConsumptiveUseMutation = useReviewerEstimateConsumptiveUseMutation();

  const onRightButtonClick = async () => {
    if (isOnMapPage) {
      // todo: why does this not share the mutation state with the map page?
      return await reviewerEstimateConsumptiveUse();
    } else {
      return navigateToApprovalPage();
    }
  };

  const reviewerEstimateConsumptiveUse = async () => {
    return await reviewerEstimateConsumptiveUseMutation.mutateAsync({
      updateEstimate: false,
    });
  };

  return (
    <div className="d-flex flex-column flex-grow-1 h-100">
      <ApplicationNavbar
        navigateBack={navigateBack}
        backButtonText={backButtonText}
        centerText="Application Review"
        centerTextIsLoading={false}
        displayWaterIcon={false}
        rightButtonDisplayed={rightButtonDisplayed}
        rightButtonText={rightButtonText}
        rightButtonIcon={mdiArrowRight}
        onRightButtonClick={onRightButtonClick}
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
