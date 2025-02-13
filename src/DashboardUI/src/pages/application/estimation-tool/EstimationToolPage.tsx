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

import './estimation-tool-page.scss';
import { useMsal } from '@azure/msal-react';
import { useConservationApplicationContext } from '../../../contexts/ConservationApplicationProvider';
import { useEffect } from 'react';

export function EstimationToolPage() {
  const navigate = useNavigate();
  const routeParams = useParams();
  const { waterRightNativeId } = routeParams;
  const context = useMsal();
  const { state, dispatch } = useConservationApplicationContext();

  const navigateToWaterRightLandingPage = () => {
    navigate(`/details/right/${waterRightNativeId}`);
  };

  const { data: fundingOrganizationDetails, isLoading: isLoadingFundingOrganization } = useFundingOrganization(
    context,
    waterRightNativeId,
  );

  useEffect(() => {
    if (fundingOrganizationDetails) {
      dispatch({
        type: 'FUNDING_ORGANIZATION_LOADED',
        payload: {
          fundingOrganizationId: fundingOrganizationDetails.fundingOrganizationId,
          fundingOrganizationName: fundingOrganizationDetails.fundingOrganizationName,
          openEtModel: fundingOrganizationDetails.openEtModel,
          dateRangeStart: fundingOrganizationDetails.dateRangeStart,
          dateRangeEnd: fundingOrganizationDetails.dateRangeEnd,
          compensationRateModel: fundingOrganizationDetails.compensationRateModel,
        },
      });
    }
  }, [fundingOrganizationDetails]);

  const { data: applicationDetails, isLoading: isLoadingApplication } = useCreateWaterConservationApplication(context, {
    waterRightNativeId: waterRightNativeId,
    fundingOrganizationId: state.conservationApplication.fundingOrganizationId,
  });

  useEffect(() => {
    if (applicationDetails) {
      dispatch({
        type: 'APPLICATION_CREATED',
        payload: {
          waterConservationApplicationId: applicationDetails.waterConservationApplicationId,
        },
      });
    }
  }, [applicationDetails]);

  const { data: consumptiveUse, isLoading: isLoadingConsumptiveUse } = useEstimateConsumptiveUse(context, {
    waterConservationApplicationId: state.conservationApplication.waterConservationApplicationId,
    waterRightNativeId: waterRightNativeId,
    // todo: update
    model: 0,
    dateRangeStart: new Date(),
    dateRangeEnd: new Date(),
    polygons: [],
    compensationRateDollars: 0,
    units: CompensationRateUnits.AcreFeet,
  });

  useEffect(() => {
    if (consumptiveUse) {
      dispatch({
        type: 'ESTIMATE_CONSUMPTIVE_USE_LOADED',
        payload: {
          consumptiveUse: consumptiveUse,
        },
      });
    }
  }, [consumptiveUse]);

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
