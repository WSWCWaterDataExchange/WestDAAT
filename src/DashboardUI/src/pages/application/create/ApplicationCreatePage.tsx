import { useNavigate } from 'react-router-dom';
import { useConservationApplicationContext } from '../../../contexts/ConservationApplicationProvider';
import { ApplicationNavbar } from '../components/ApplicationNavbar';
import ApplicationSubmissionFormLayout from '../components/ApplicationSubmissionFormLayout';

export function ApplicationCreatePage() {
  const { state } = useConservationApplicationContext();
  const navigate = useNavigate();

  const navigateToEstimationToolPage = () => {
    navigate(`/application/${state.conservationApplication.waterRightNativeId}/estimation`);
  };

  return (
    <div className="d-flex flex-column flex-grow-1 h-100">
      <ApplicationNavbar
        navigateBack={navigateToEstimationToolPage}
        backButtonText="Back to Estimator"
        centerText="Water Conservation Estimation Tool"
      />

      <div className="overflow-y-auto">
        <ApplicationSubmissionFormLayout />
      </div>
    </div>
  );
}
