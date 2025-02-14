import { useNavigate, useParams } from 'react-router-dom';
import { EstimationToolSidebar } from './EstimationToolSidebar';
import { EstimationToolMapHeader } from './EstimationToolMapHeader';
import { EstimationToolMap } from './EstimationToolMap';
import MapProvider from '../../../contexts/MapProvider';
import { EstimationToolNavbar } from './EstimationToolNavbar';
import { useFundingOrganization } from './hooks/useFundingOrganization';
import { useCreateWaterConservationApplication } from './hooks/useCreateWaterConservationApplication';
import { useEstimateConsumptiveUse } from './hooks/useEstimateConsumptiveUse';
import { useMsal } from '@azure/msal-react';
import { useConservationApplicationContext } from '../../../contexts/ConservationApplicationProvider';
import { useEffect } from 'react';

import './estimation-tool-page.scss';

export function EstimationToolPage() {
  const navigate = useNavigate();
  const routeParams = useParams();
  const context = useMsal();
  const { state, dispatch } = useConservationApplicationContext();

  const { waterRightNativeId } = routeParams;

  useEffect(() => {
    if (waterRightNativeId) {
      dispatch({
        type: 'WATER_RIGHT_LOADED',
        payload: {
          waterRightNativeId: waterRightNativeId,
        },
      });
    }
  }, [waterRightNativeId]);

  const { isLoading: isLoadingFundingOrganization } = useFundingOrganization(
    state.conservationApplication.waterRightNativeId,
  );

  const { data: applicationDetails, isLoading: isLoadingApplication } = useCreateWaterConservationApplication({
    waterRightNativeId: waterRightNativeId,
    fundingOrganizationId: state.conservationApplication.fundingOrganizationId,
  });

  const estimateConsumptiveUseMutation = useEstimateConsumptiveUse();

  const navigateToWaterRightLandingPage = () => {
    navigate(`/details/right/${waterRightNativeId}`);
  };

  return (
    <MapProvider>
      <div className="estimation-tool-page d-flex flex-column flex-grow-1 overflow-hidden h-100">
        <EstimationToolNavbar navigateToWaterRightLandingPage={navigateToWaterRightLandingPage} />

        <div className="flex-grow-1 overflow-y-auto">
          <div className="h-100 d-flex overflow-y-auto align-items-stretch">
            <div className="estimation-tool-side-panel d-flex flex-column overflow-y-auto">
              <EstimationToolSidebar isLoadingFundingOrganization={isLoadingFundingOrganization} />
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
