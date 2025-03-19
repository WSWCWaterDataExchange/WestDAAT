import { useNavigate, useParams } from 'react-router-dom';
import { ApplicationNavbar } from '../components/ApplicationNavbar';
import ApplicationSubmissionForm from '../components/ApplicationSubmissionForm';
import { useFundingOrganizationQuery, useGetApplicationQuery } from '../../../hooks/queries/useApplicationQuery';
import { useConservationApplicationContext } from '../../../contexts/ConservationApplicationProvider';
import useDirtyFormCheck from '../../../hooks/useDirtyFormCheck';
import ApplicationReviewHeader from '../components/ApplicationReviewHeader';
import { ApplicationReviewPerspective } from '../../../data-contracts/ApplicationReviewPerspective';

const perspective: ApplicationReviewPerspective = 'reviewer'; // hard-coded for this page

function ApplicationReviewPage() {
  const navigate = useNavigate();
  const { applicationId } = useParams();
  const { state } = useConservationApplicationContext();

  const navigateToApplicationOrganizationDashboard = () => {
    navigate(`/application/organization/dashboard`);
  };

  const { isLoading: isApplicationLoading } = useGetApplicationQuery(applicationId, 'reviewer', true);
  const { isLoading: isFundingOrganizationLoading } = useFundingOrganizationQuery(
    state.conservationApplication.waterRightNativeId,
  );

  const isFormDirty = useDirtyFormCheck(state.conservationApplication.applicationSubmissionForm, {
    isEnabled: !isApplicationLoading && !isFundingOrganizationLoading,
  });

  return (
    <div className="d-flex flex-column flex-grow-1 h-100">
      <ApplicationNavbar
        navigateBack={navigateToApplicationOrganizationDashboard}
        backButtonText="Back to Dashboard"
        centerText="Water Conservation Estimation Tool"
      />

      <div className="overflow-y-auto">
        {!isApplicationLoading && !isFundingOrganizationLoading && (
          <main className="container">
            <ApplicationReviewHeader perspective={perspective} />
            <ApplicationSubmissionForm perspective={perspective} isFormDirty={isFormDirty} />
          </main>
        )}
      </div>
    </div>
  );
}

export default ApplicationReviewPage;
