import { useParams } from 'react-router-dom';
import { NotImplementedPlaceholder } from '../../../components/NotImplementedAlert';

export function ConservationEstimationToolPage() {
  const routeParams = useParams();
  const { waterRightNativeId } = routeParams;

  return <NotImplementedPlaceholder />;
}
