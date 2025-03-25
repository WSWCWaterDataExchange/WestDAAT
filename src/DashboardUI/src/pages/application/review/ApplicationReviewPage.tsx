import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ApplicationNavbar } from '../components/ApplicationNavbar';
import ApplicationReviewHeader from '../components/ApplicationReviewHeader';
import { ApplicationReviewPerspective } from '../../../data-contracts/ApplicationReviewPerspective';
import { useMemo } from 'react';
import { useFundingOrganizationQuery, useGetApplicationQuery } from '../../../hooks/queries/useApplicationQuery';
import { useConservationApplicationContext } from '../../../contexts/ConservationApplicationProvider';

const perspective: ApplicationReviewPerspective = 'reviewer';

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
        centerText="Water Conservation Estimation Tool"
      />

      <div className="overflow-y-auto">
        {!state.isLoadingApplication && !state.isLoadingFundingOrganization && (
          <div className="container">
            <ApplicationReviewHeader perspective={perspective} />

            <Outlet />
          </div>
        )}
      </div>
    </div>
  );
}

export default ApplicationReviewPage;
