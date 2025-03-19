import { useNavigate, useParams } from 'react-router-dom';
import { ApplicationNavbar } from '../components/ApplicationNavbar';
import ApplicationSubmissionFormData from '../components/ApplicationSubmissionFormData';
import { useFundingOrganizationQuery, useGetApplicationQuery } from '../../../hooks/queries/useApplicationQuery';
import { useConservationApplicationContext } from '../../../contexts/ConservationApplicationProvider';
import { useEffect, useState } from 'react';
import { ApplicationSubmissionForm } from '../../../data-contracts/ApplicationSubmissionForm';
import deepEqual from 'fast-deep-equal/es6';

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

  const [initialFormValue, setInitialFormValue] = useState<ApplicationSubmissionForm | null>(null);

  useEffect(() => {
    if (isApplicationLoading || isFundingOrganizationLoading || initialFormValue) return;

    const v = JSON.parse(JSON.stringify(state.conservationApplication.applicationSubmissionForm));
    setInitialFormValue(v);
    console.log('initialFormValue', v);
  }, [isApplicationLoading, isFundingOrganizationLoading, state.conservationApplication.applicationSubmissionForm]);

  const [isFormDirty, setIsFormDirty] = useState(false);
  useEffect(() => {
    if (initialFormValue && state.conservationApplication.applicationSubmissionForm) {
      const d = !deepEqual(initialFormValue, state.conservationApplication.applicationSubmissionForm);
      setIsFormDirty(d);
      console.log('isFormDirty', d);
    }
  }, [state.conservationApplication.applicationSubmissionForm, initialFormValue]);

  return (
    <div className="d-flex flex-column flex-grow-1 h-100">
      <ApplicationNavbar
        navigateBack={navigateToApplicationOrganizationDashboard}
        backButtonText="Back to Dashboard"
        centerText="Water Conservation Estimation Tool"
      />

      <div className="overflow-y-auto">
        {!isApplicationLoading && !isFundingOrganizationLoading && !!initialFormValue && (
          <ApplicationSubmissionFormData perspective="reviewer" isFormDirty={isFormDirty} />
        )}
      </div>
    </div>
  );
}

export default ApplicationReviewPage;
