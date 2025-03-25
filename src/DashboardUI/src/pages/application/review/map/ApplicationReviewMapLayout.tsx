import { useOutletContext } from 'react-router-dom';
import { ApplicationReviewMap, ApplicationReviewMapProps } from './ApplicationReviewMap';

function ApplicationReviewMapLayout() {
  const componentProps = useOutletContext<ApplicationReviewMapProps>();

  return <ApplicationReviewMap {...componentProps} />;
}

export default ApplicationReviewMapLayout;
