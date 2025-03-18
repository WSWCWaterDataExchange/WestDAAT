import { useNavigate } from 'react-router-dom';
import { ApplicationNavbar } from '../components/ApplicationNavbar';
import ApplicationSubmissionFormLayout from '../components/ApplicationSubmissionFormLayout';

function ApplicationReviewPage() {
  const navigate = useNavigate();

  const navigateToApplicationOrganizationDashboard = () => {
    navigate(`/application/organization/dashboard`);
  };

  return (
    <div className="d-flex flex-column flex-grow-1 h-100">
      <ApplicationNavbar
        navigateBack={navigateToApplicationOrganizationDashboard}
        backButtonText="Back to Dashboard"
        centerText="Water Conservation Estimation Tool"
      />

      <div className="overflow-y-auto">
        <ApplicationSubmissionFormLayout />
      </div>
    </div>
  );
}

export default ApplicationReviewPage;
