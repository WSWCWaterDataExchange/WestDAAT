import { useNavigate, useParams } from 'react-router-dom';
import { EstimationToolSidebar } from './EstimationToolSidebar';
import { EstimationToolMapHeader } from './EstimationToolMapHeader';
import { EstimationToolMap } from './EstimationToolMap';
import MapProvider from '../../../contexts/MapProvider';
import { EstimationToolNavbar } from './EstimationToolNavbar';
import { useFundingOrganization } from './hooks/useFundingOrganization';

import './estimation-tool-page.scss';

export function EstimationToolPage() {
  const navigate = useNavigate();
  const routeParams = useParams();
  const { waterRightNativeId } = routeParams;

  const navigateToWaterRightLandingPage = () => {
    navigate(`/details/right/${waterRightNativeId}`);
  };

  const { data: fundingOrganizationDetails, isLoading: isLoadingFundingOrganization } =
    useFundingOrganization(waterRightNativeId);

  return (
    <MapProvider>
      <div className="estimation-tool-page d-flex flex-column">
        <EstimationToolNavbar navigateToWaterRightLandingPage={navigateToWaterRightLandingPage} />

        <div className="flex-grow-1 overflow-y-auto">
          <div className="h-100 d-flex overflow-hidden align-items-stretch">
            <div className="estimation-tool-side-panel d-flex flex-column overflow-y-auto">
              <EstimationToolSidebar
                fundingOrganizationDetails={fundingOrganizationDetails}
                isLoadingFundingOrganization={isLoadingFundingOrganization}
              />
            </div>

            <div className="flex-grow-1 d-flex flex-column overflow-y-auto">
              <EstimationToolMapHeader />
              <EstimationToolMap />
            </div>
          </div>
        </div>
      </div>
    </MapProvider>
  );
}
