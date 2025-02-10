import { useNavigate, useParams } from 'react-router-dom';
import SidePanel from '../../../components/home-page/SidePanel';
import { EstimationToolSidebar } from './EstimationToolSidebar';
import MainPanel from '../../../components/home-page/MainPanel';
import { EstimationToolMapHeader } from './EstimationToolMapHeader';
import { EstimationToolMap } from './EstimationToolMap';
import MapProvider from '../../../contexts/MapProvider';

import './estimation-tool-page.scss';
import { EstimationToolNavbar } from './EstimationToolNavbar';

export function EstimationToolPage() {
  const navigate = useNavigate();
  const routeParams = useParams();
  const { waterRightNativeId } = routeParams;

  const navigateToWaterRightLandingPage = () => {
    navigate(`/details/right/${waterRightNativeId}`);
  };

  return (
    <MapProvider>
      <div className="estimation-tool-page d-flex flex-column">
        <EstimationToolNavbar navigateToWaterRightLandingPage={navigateToWaterRightLandingPage} />
        <div className="d-inline-flex flex-grow-1 overflow-hidden align-items-stretch">
          <SidePanel>
            <EstimationToolSidebar />
          </SidePanel>
          <MainPanel>
            <EstimationToolMapHeader />
            <EstimationToolMap />
          </MainPanel>
        </div>
      </div>
    </MapProvider>
  );
}
