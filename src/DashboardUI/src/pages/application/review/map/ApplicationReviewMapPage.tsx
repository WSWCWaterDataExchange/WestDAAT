import { NotImplementedPlaceholder } from '../../../../components/NotImplementedAlert';
import { useConservationApplicationContext } from '../../../../contexts/ConservationApplicationProvider';

export function ApplicationReviewMapPage() {
  const { state } = useConservationApplicationContext();

  return (
    <div>
      <NotImplementedPlaceholder />
    </div>
  );
}
