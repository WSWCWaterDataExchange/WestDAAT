import { useParams } from 'react-router-dom';
import { NotImplementedPlaceholder } from '../../../components/NotImplementedAlert';
import SidePanel from '../../../components/home-page/SidePanel';
import { EstimationToolSidebar } from './EstimationToolSidebar';
import MainPanel from '../../../components/home-page/MainPanel';
import { EstimationToolMapHeader } from './EstimationToolMapHeader';
import { EstimationToolMap } from './EstimationToolMap';
import MapProvider from '../../../contexts/MapProvider';

export function EstimationToolPage() {
  const routeParams = useParams();
  const { waterRightNativeId } = routeParams;

  return (
    <MapProvider>
      <EstimationToolLayout />
    </MapProvider>
  );
}

function EstimationToolLayout() {
  return (
    <>
      <SidePanel>
        <EstimationToolSidebar />
      </SidePanel>
      <MainPanel>
        <EstimationToolMapHeader />
        <EstimationToolMap />
      </MainPanel>
    </>
  );
}
