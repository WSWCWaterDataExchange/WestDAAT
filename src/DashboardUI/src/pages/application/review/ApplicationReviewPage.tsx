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
          <ApplicationSubmissionFormData perspective="reviewer" isFormDirty={isFormDirty} />
        )}
      </div>
    </div>
  );
}

export default ApplicationReviewPage;

function useDirtyFormCheck(
  formValues: any,
  options: {
    isEnabled: boolean;
  },
): boolean {
  const [initialFormValue, setInitialFormValue] = useState<any>(null);
  const [isFormDirty, setIsFormDirty] = useState(false);

  useEffect(() => {
    const isInitialFormValueSet = initialFormValue !== null;
    if (!options.isEnabled || isInitialFormValueSet) return;

    setInitialFormValue(JSON.parse(JSON.stringify(formValues)));
  }, [formValues, options.isEnabled, initialFormValue]);

  useEffect(() => {
    if (!options.isEnabled) return;

    if (initialFormValue && formValues) {
      const dirty = !deepEqual(initialFormValue, formValues);
      setIsFormDirty(dirty);
    }
  }, [options.isEnabled, initialFormValue, formValues]);

  return isFormDirty;
}
