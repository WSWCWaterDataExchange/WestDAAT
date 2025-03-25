import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ApplicationNavbar } from '../components/ApplicationNavbar';
import ApplicationReviewHeader from '../components/ApplicationReviewHeader';
import { ApplicationReviewPerspective } from '../../../data-contracts/ApplicationReviewPerspective';
import { useMemo } from 'react';
import { ApplicationReviewPageProvider, useApplicationReviewPageContext } from './Provider';

const perspective: ApplicationReviewPerspective = 'reviewer';

function ApplicationReviewPage() {
  const navigate = useNavigate();
  const pageState = useApplicationReviewPageContext();
  const location = useLocation();

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

  const { isLoading: isApplicationLoading } = pageState.getApplicationQuery;
  const { isLoading: isFundingOrganizationLoading } = pageState.getFundingOrganizationQuery;

  return (
    <ApplicationReviewPageProvider>
      <div className="d-flex flex-column flex-grow-1 h-100">
        <ApplicationNavbar
          navigateBack={navigateBack}
          backButtonText={backButtonText}
          centerText="Water Conservation Estimation Tool"
        />

        <div className="overflow-y-auto">
          {!isApplicationLoading && !isFundingOrganizationLoading && (
            <div className="container">
              <ApplicationReviewHeader perspective={perspective} />

              <Outlet />
            </div>
          )}
        </div>
      </div>
    </ApplicationReviewPageProvider>
  );
}

export default ApplicationReviewPage;
