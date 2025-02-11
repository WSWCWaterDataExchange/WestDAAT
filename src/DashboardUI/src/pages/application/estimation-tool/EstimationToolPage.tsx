import { useNavigate, useParams } from 'react-router-dom';
import { EstimationToolSidebar } from './EstimationToolSidebar';
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

        <div className="flex-grow-1">
          <div className="h-100 d-flex overflow-hidden align-items-stretch">
            <div className="side-panel d-flex flex-column">
              <EstimationToolSidebar />
            </div>

            <div className="flex-grow-1 position-relative d-flex flex-column">
              <EstimationToolMapHeader />
              <EstimationToolMap />
            </div>
          </div>
        </div>
      </div>
    </MapProvider>
  );
}
