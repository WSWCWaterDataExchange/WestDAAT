import { useMemo, useState } from 'react';
import Alert from 'react-bootstrap/esm/Alert';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useConservationApplicationContext } from '../../../contexts/ConservationApplicationProvider';
import { useFundingOrganizationQuery, useGetApplicationQuery } from '../../../hooks/queries/useApplicationQuery';
import { ApplicationNavbar } from '../components/ApplicationNavbar';
import ApplicationReviewHeader from '../components/ApplicationReviewHeader';
import { useAuthenticationContext } from '../../../hooks/useAuthenticationContext';
import { hasPermission } from '../../../utilities/securityHelpers';
import { Permission } from '../../../roleConfig';
import { mdiArrowRight } from '@mdi/js';
import { CancelChangesModal } from './form/CancelChangesModal';

function ApplicationReviewPage() {
  const navigate = useNavigate();
  const { applicationId } = useParams();
  const location = useLocation();
  const { state } = useConservationApplicationContext();
  const { user } = useAuthenticationContext();
  const [showCancelConfirmationModal, setShowCancelConfirmationModal] = useState(false);
  const [cancelModalNavigateTo, setCancelModalNavigateTo] = useState<string | undefined>();

  useGetApplicationQuery(applicationId, 'reviewer', true);
  useFundingOrganizationQuery(state.conservationApplication.waterRightNativeId);

  const upOneLevelPath = '.';
  const applicationOrganizationDashboardPath = '/application/organization/dashboard';
  const applicationApprovePath = `/application/${state.conservationApplication.waterConservationApplicationId}/approve`;

  const isOnMapPage = location.pathname.includes('map');

  const backButtonText: string = useMemo(() => {
    return isOnMapPage ? 'Back to Application' : 'Back to Dashboard';
  }, [isOnMapPage]);

  const canApproveApplication = hasPermission(user, Permission.ApplicationApprove);

  const navigateBack = () => {
    if (state.conservationApplication.isDirty) {
      setShowCancelConfirmationModal(true);
      isOnMapPage
        ? setCancelModalNavigateTo(upOneLevelPath)
        : setCancelModalNavigateTo(applicationOrganizationDashboardPath);
    } else {
      isOnMapPage ? navigate(upOneLevelPath) : navigate(applicationOrganizationDashboardPath);
    }
  };

  const navigateToApprovalPage = () => {
    if (state.conservationApplication.isDirty) {
      setShowCancelConfirmationModal(true);
      setCancelModalNavigateTo(applicationApprovePath);
    } else {
      navigate(applicationApprovePath);
    }
  };

  const handleCancelConfirmed = () => {
    setShowCancelConfirmationModal(false);

    if (cancelModalNavigateTo) {
      navigate(cancelModalNavigateTo);
    }
  };

  return (
    <div className="d-flex flex-column flex-grow-1 h-100">
      <ApplicationNavbar
        navigateBack={navigateBack}
        backButtonText={backButtonText}
        centerText="Application Review"
        centerTextIsLoading={false}
        displayWaterIcon={false}
        rightButtonDisplayed={canApproveApplication}
        rightButtonText="Continue to Final Approval"
        rightButtonIcon={mdiArrowRight}
        onRightButtonClick={navigateToApprovalPage}
      />

      <div className="overflow-y-auto">
        {!state.loadApplicationErrored && !state.loadFundingOrganizationErrored && (
          <>
            <div className="container">
              <ApplicationReviewHeader />
            </div>

            <Outlet />
            <CancelChangesModal
              show={showCancelConfirmationModal}
              onConfirm={handleCancelConfirmed}
              onCancel={() => setShowCancelConfirmationModal(false)}
            />
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
