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
      <div className="estimation-tool-page d-flex flex-column flex-grow-1 overflow-hidden align-items-stretch h-100">
        <EstimationToolNavbar navigateToWaterRightLandingPage={navigateToWaterRightLandingPage} />

        <div className="flex-grow-1 overflow-y-auto h-100">
          <div className="h-100 d-flex overflow-y-auto align-items-stretch h-100">
            <div className="estimation-tool-side-panel d-flex flex-column overflow-y-auto h-100">
              <EstimationToolSidebar />
            </div>

            <div className="flex-grow-1 d-flex flex-column overflow-y-auto h-100">
              <EstimationToolMapHeader />
              <EstimationToolMap />
            </div>
          </div>
        </div>
      </div>
    </MapProvider>
  );
}
