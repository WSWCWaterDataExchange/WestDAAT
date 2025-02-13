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

  const { data: fundingOrganizationDetails, isLoading: isLoadingFundingOrganization } = useFundingOrganization(
    context,
    state.conservationApplication.waterRightNativeId,
  );

  useEffect(() => {
    if (fundingOrganizationDetails) {
      dispatch({
        type: 'FUNDING_ORGANIZATION_LOADED',
        payload: {
          fundingOrganizationId: fundingOrganizationDetails.fundingOrganizationId,
          fundingOrganizationName: fundingOrganizationDetails.fundingOrganizationName,
          openEtModelName: fundingOrganizationDetails.openEtModelName,
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
    waterRightNativeId: state.conservationApplication.waterRightNativeId,
    model: 1, // this field will probably get stripped out since we'll look up the model from the funding org in the backend
    dateRangeStart: state.conservationApplication.dateRangeStart,
    dateRangeEnd: state.conservationApplication.dateRangeEnd,
    polygonWkts: state.conservationApplication.selectedMapPolygons.map((polygon) => polygon.polygonWkt),
    compensationRateDollars: state.conservationApplication.desiredCompensationDollars,
    units: state.conservationApplication.desiredCompensationUnits,
  });

  useEffect(() => {
    if (consumptiveUse) {
      dispatch({
        type: 'ESTIMATE_CONSUMPTIVE_USE_LOADED',
        payload: {
          totalAverageYearlyEtAcreFeet: consumptiveUse.totalAverageYearlyEtAcreFeet,
          conservationPayment: consumptiveUse.conservationPayment,
          dataCollections: consumptiveUse.dataCollections,
        },
      });
    }
  }, [consumptiveUse]);

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
