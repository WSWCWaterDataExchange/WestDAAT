import { NotImplementedPlaceholder } from '../../../../components/NotImplementedAlert';
import { useApplicationReviewPageContext } from '../Provider';

export function ApplicationReviewMapPage() {
  const pageState = useApplicationReviewPageContext();

  return (
    <div>
      <NotImplementedPlaceholder />
    </div>
  );
}
