import { useNavigate, useParams } from 'react-router-dom';
import { EstimationToolSidebar } from './EstimationToolSidebar';
import { EstimationToolMapHeader } from './EstimationToolMapHeader';
import { EstimationToolMap } from './EstimationToolMap';
import MapProvider from '../../../contexts/MapProvider';
import { EstimationToolNavbar } from './EstimationToolNavbar';
import { useFundingOrganization } from './hooks/useFundingOrganization';
import { useCreateWaterConservationApplication } from './hooks/useCreateWaterConservationApplication';
import { useEstimateConsumptiveUse } from './hooks/useEstimateConsumptiveUse';
import { CompensationRateUnits } from '../../../data-contracts/CompensationRateUnits';
import { useMsal } from '@azure/msal-react';

import './estimation-tool-page.scss';

export function EstimationToolPage() {
  const navigate = useNavigate();
  const routeParams = useParams();
  const { waterRightNativeId } = routeParams;
  const context = useMsal();

  const navigateToWaterRightLandingPage = () => {
    navigate(`/details/right/${waterRightNativeId}`);
  };

  const { data: fundingOrganizationDetails, isLoading: isLoadingFundingOrganization } = useFundingOrganization(
    context,
    waterRightNativeId,
  );

  const { data: applicationDetails, isLoading: isLoadingApplication } = useCreateWaterConservationApplication(context, {
    waterRightNativeId: waterRightNativeId,
    fundingOrganizationId: fundingOrganizationDetails?.fundingOrganizationId,
  });

  const { data: estimateConsumptiveUse, isLoading: isLoadingEstimateConsumptiveUse } = useEstimateConsumptiveUse(
    context,
    {
      waterConservationApplicationId: applicationDetails?.waterConservationApplicationId,
      waterRightNativeId: waterRightNativeId,
      // todo: update
      model: 0,
      dateRangeStart: new Date(),
      dateRangeEnd: new Date(),
      polygons: [],
      compensationRateDollars: 0,
      units: CompensationRateUnits.AcreFeet,
    },
  );

  return (
    <MapProvider>
      <div className="estimation-tool-page d-flex flex-column flex-grow-1 overflow-hidden h-100">
        <EstimationToolNavbar navigateToWaterRightLandingPage={navigateToWaterRightLandingPage} />

        <div className="flex-grow-1 overflow-y-auto">
          <div className="h-100 d-flex overflow-y-auto align-items-stretch">
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
