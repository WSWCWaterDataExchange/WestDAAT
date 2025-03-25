import { useOutletContext } from 'react-router-dom';
import { ApplicationReviewForm, ApplicationReviewFormProps } from './ApplicationReviewForm';

function ApplicationReviewFormLayout() {
  const componentProps = useOutletContext<ApplicationReviewFormProps>();

  return <ApplicationReviewForm {...componentProps} />;
}

export default ApplicationReviewFormLayout;
