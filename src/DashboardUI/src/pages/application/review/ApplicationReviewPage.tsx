import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ApplicationNavbar } from '../components/ApplicationNavbar';
import { useFundingOrganizationQuery, useGetApplicationQuery } from '../../../hooks/queries/useApplicationQuery';
import { useConservationApplicationContext } from '../../../contexts/ConservationApplicationProvider';
import ApplicationReviewHeader from '../components/ApplicationReviewHeader';
import { ApplicationReviewPerspective } from '../../../data-contracts/ApplicationReviewPerspective';
import { useMemo } from 'react';
import { ApplicationReviewFormProps } from './form/ApplicationReviewForm';
import { ApplicationReviewMapProps } from './map/ApplicationReviewMap';
import { ApplicationReviewPageProvider } from './Provider';

const perspective: ApplicationReviewPerspective = 'reviewer';

function ApplicationReviewPage() {
  const navigate = useNavigate();
  const { applicationId } = useParams();
  const { state } = useConservationApplicationContext();
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

  const { isLoading: isApplicationLoading } = useGetApplicationQuery(applicationId, 'reviewer', true);
  const { isLoading: isFundingOrganizationLoading } = useFundingOrganizationQuery(
    state.conservationApplication.waterRightNativeId,
  );

  const outletContext: ApplicationReviewFormProps & ApplicationReviewMapProps = {
    isApplicationLoading,
    isFundingOrganizationLoading,
  };

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

              <Outlet context={outletContext} />
            </div>
          )}
        </div>
      </div>
    </ApplicationReviewPageProvider>
  );
}

export default ApplicationReviewPage;
