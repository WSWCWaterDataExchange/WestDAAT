import { useNavigate, useParams } from 'react-router-dom';
import { EstimationToolSidebar } from './EstimationToolSidebar';
import { EstimationToolMapHeader } from './EstimationToolMapHeader';
import { EstimationToolMap } from './EstimationToolMap';
import MapProvider from '../../../contexts/MapProvider';
import { EstimationToolNavbar } from './EstimationToolNavbar';
import { useFundingOrganizationQuery } from './hooks/useFundingOrganizationQuery';
import { useCreateWaterConservationApplicationQuery } from './hooks/useCreateWaterConservationApplicationQuery';
import { useEstimateConsumptiveUseMutation } from './hooks/useEstimateConsumptiveUseMutation';
import { useConservationApplicationContext } from '../../../contexts/ConservationApplicationProvider';
import { useEffect } from 'react';

import './estimation-tool-page.scss';

export function EstimationToolPage() {
  const navigate = useNavigate();
  const routeParams = useParams();
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

  const { isLoading: isLoadingFundingOrganization } = useFundingOrganizationQuery(
    state.conservationApplication.waterRightNativeId,
  );

  const { data: applicationDetails, isLoading: isLoadingApplication } = useCreateWaterConservationApplicationQuery({
    waterRightNativeId: state.conservationApplication.waterRightNativeId,
    fundingOrganizationId: state.conservationApplication.fundingOrganizationId,
  });

  const estimateConsumptiveUseMutation = useEstimateConsumptiveUseMutation();

  const handleEstimateConsumptiveUseClicked = async () => {
    await estimateConsumptiveUseMutation.mutateAsync({
      waterRightNativeId: state.conservationApplication.waterRightNativeId,
      waterConservationApplicationId: state.conservationApplication.waterConservationApplicationId,
      model: 0,
      dateRangeStart: state.conservationApplication.dateRangeStart,
      dateRangeEnd: state.conservationApplication.dateRangeEnd,
      polygonWkts: state.conservationApplication.selectedMapPolygons.map((polygon) => polygon.polygonWkt),
      compensationRateDollars: state.conservationApplication.desiredCompensationDollars,
      units: state.conservationApplication.desiredCompensationUnits,
    });
  };

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
              <EstimationToolMap handleEstimateConsumptiveUseClicked={handleEstimateConsumptiveUseClicked} />
            </div>
          </div>
        </div>
      </div>
    </MapProvider>
  );
}
