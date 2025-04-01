import { useNavigate } from 'react-router-dom';
import { NotImplementedPlaceholder } from '../../../components/NotImplementedAlert';
import { ApplicationNavbar } from '../components/ApplicationNavbar';

export function ApplicationApprovePage() {
  const navigate = useNavigate();

  const navigateBack = () => {
    navigate(`/application/organization/dashboard`);
  };

  return (
    <div className="d-flex flex-column flex-grow-1 h-100">
      <ApplicationNavbar
        navigateBack={navigateBack}
        backButtonText="Back to Dashboard"
        centerText="Water Conservation Estimation Tool"
      />

      <NotImplementedPlaceholder />
    </div>
  );
}
