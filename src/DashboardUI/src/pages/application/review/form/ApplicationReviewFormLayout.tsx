import { useOutletContext } from 'react-router-dom';
import { ApplicationReviewForm, ApplicationReviewFormProps } from './ApplicationReviewForm';

function ApplicationReviewFormLayout() {
  const { isApplicationLoading, isFundingOrganizationLoading } = useOutletContext<ApplicationReviewFormProps>();

  return (
    <ApplicationReviewForm
      isApplicationLoading={isApplicationLoading}
      isFundingOrganizationLoading={isFundingOrganizationLoading}
    />
  );
}

export default ApplicationReviewFormLayout;
