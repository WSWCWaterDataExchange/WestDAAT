import { useParams } from 'react-router-dom';
import { NotImplementedPlaceholder } from '../../../components/NotImplementedAlert';

export function EstimationToolPage() {
  const routeParams = useParams();
  const { waterRightNativeId } = routeParams;

  return <NotImplementedPlaceholder />;
}
