import { useNavigate, useParams } from 'react-router-dom';
import { NotImplementedPlaceholder } from '../../../components/NotImplementedAlert';
import { ApplicationNavbar } from '../components/ApplicationNavbar';
import { useGetApplicationQuery } from '../../../hooks/queries/useApplicationQuery';
import { useConservationApplicationContext } from '../../../contexts/ConservationApplicationProvider';
import ApplicationReviewHeader from '../components/ApplicationReviewHeader';

export function ApplicationApprovePage() {
  const navigate = useNavigate();
  const { applicationId } = useParams();
  const { state } = useConservationApplicationContext();

  const navigateBack = () => {
    navigate(`/application/organization/dashboard`);
  };

  useGetApplicationQuery(applicationId, 'reviewer', true);

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
        <div className="container">
          <ApplicationReviewHeader />

          <NotImplementedPlaceholder />
        </div>
      </div>
    </div>
  );
}
