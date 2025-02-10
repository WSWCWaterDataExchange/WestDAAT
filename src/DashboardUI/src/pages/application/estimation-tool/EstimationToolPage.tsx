import { useParams } from 'react-router-dom';
import { NotImplementedPlaceholder } from '../../../components/NotImplementedAlert';
import SidePanel from '../../../components/home-page/SidePanel';
import { EstimationToolSidebar } from './EstimationToolSidebar';
import MainPanel from '../../../components/home-page/MainPanel';
import { EstimationToolMapHeader } from './EstimationToolMapHeader';
import { EstimationToolMap } from './EstimationToolMap';
import MapProvider from '../../../contexts/MapProvider';

import './estimation-tool-page.scss';

export function EstimationToolPage() {
  const routeParams = useParams();
  const { waterRightNativeId } = routeParams;

  return (
    <div className="d-inline-flex flex-grow-1 overflow-hidden align-items-stretch">
      <MapProvider>
        <EstimationToolLayout />
      </MapProvider>
    </div>
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
