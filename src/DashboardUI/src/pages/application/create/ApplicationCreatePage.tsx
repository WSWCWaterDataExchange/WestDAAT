import { useNavigate } from 'react-router-dom';
import { NotImplementedPlaceholder } from '../../../components/NotImplementedAlert';
import MapProvider from '../../../contexts/MapProvider';
import { ApplicationNavbar } from '../components/ApplicationNavbar';
import { useConservationApplicationContext } from '../../../contexts/ConservationApplicationProvider';

export function ApplicationCreatePage() {
  const { state } = useConservationApplicationContext();
  const navigate = useNavigate();

  const navigateToEstimationToolPage = () => {
    navigate(`/application/${state.conservationApplication.waterRightNativeId}/estimation`);
  };

  return (
    <MapProvider>
      <div className="application-create-page d-flex flex-column flex-grow-1 h-100">
        <ApplicationNavbar
          navigateBack={navigateToEstimationToolPage}
          backButtonText="Back to Estimator"
          centerText="Water Conservation Estimation Tool"
        />
      </div>
    </MapProvider>
  );
}
