import { useNavigate, useParams } from 'react-router-dom';
import { EstimationToolSidebar } from './EstimationToolSidebar';
import { EstimationToolMapHeader } from './EstimationToolMapHeader';
import { EstimationToolMap } from './EstimationToolMap';
import { useConservationApplicationContext } from '../../../contexts/ConservationApplicationProvider';
import { useEffect } from 'react';
import {
  useCreateWaterConservationApplicationQuery,
  useFundingOrganizationQuery,
} from '../../../hooks/queries/useApplicationQuery';
import { useMutation } from 'react-query';
import { CompensationRateUnits } from '../../../data-contracts/CompensationRateUnits';
import { estimateConsumptiveUse } from '../../../accessors/applicationAccessor';
import { useMsal } from '@azure/msal-react';
import { EstimateConsumptiveUseResponse } from '../../../data-contracts/EstimateConsumptiveUseResponse';
import { toast } from 'react-toastify';
import { ApplicationNavbar } from '../components/ApplicationNavbar';

import './estimation-tool-page.scss';

export function EstimationToolPage() {
  const context = useMsal();
  const navigate = useNavigate();
  const routeParams = useParams();
  const { state, dispatch } = useConservationApplicationContext();

  const { waterRightNativeId } = routeParams;

  useEffect(() => {
    if (waterRightNativeId) {
      dispatch({
        type: 'ESTIMATION_TOOL_PAGE_LOADED',
        payload: {
          waterRightNativeId: waterRightNativeId,
        },
      });
    }
  }, [waterRightNativeId]);

  const { isLoading: isLoadingFundingOrganization, isError: fundingOrganizationLoadFailed } =
    useFundingOrganizationQuery(state.conservationApplication.waterRightNativeId);

  const { isLoading: isLoadingApplication, isError: applicationLoadFailed } =
    useCreateWaterConservationApplicationQuery({
      waterRightNativeId: state.conservationApplication.waterRightNativeId,
      fundingOrganizationId: state.conservationApplication.fundingOrganizationId,
    });

  const estimateConsumptiveUseMutation = useMutation({
    mutationFn: async (fields: EstimateConsumptiveUseApiCallFields) => {
      validateFields(fields);

      const apiCallFields: Parameters<typeof estimateConsumptiveUse>[1] = {
        waterRightNativeId: fields.waterRightNativeId!,
        waterConservationApplicationId: fields.waterConservationApplicationId!,
        polygonWkts: fields.polygonWkts!,
        compensationRateDollars: fields.compensationRateDollars,
        units: fields.units,
      };

      return await estimateConsumptiveUse(context, apiCallFields);
    },
    onSuccess: (result: EstimateConsumptiveUseResponse) => {
      if (result) {
        dispatch({
          type: 'CONSUMPTIVE_USE_ESTIMATED',
          payload: {
            totalAverageYearlyEtAcreFeet: result.totalAverageYearlyEtAcreFeet,
            conservationPayment: result.conservationPayment,
            dataCollections: result.dataCollections,
          },
        });
      }
    },
    onError: (error: Error) => {
      toast.error('Failed to estimate consumptive use. Please try again later.');
    },
  });

  const handleEstimateConsumptiveUseClicked = async () => {
    await estimateConsumptiveUseMutation.mutateAsync({
      waterRightNativeId: state.conservationApplication.waterRightNativeId,
      waterConservationApplicationId: state.conservationApplication.waterConservationApplicationId,
      polygonWkts: state.conservationApplication.estimateLocations.map((polygon) => polygon.polygonWkt!),
      compensationRateDollars: state.conservationApplication.desiredCompensationDollars,
      units: state.conservationApplication.desiredCompensationUnits,
    });
  };

  const navigateToWaterRightLandingPage = () => {
    navigate(`/details/right/${waterRightNativeId}`);
  };

  return (
    <main className="estimation-tool-page d-flex flex-column flex-grow-1 overflow-hidden h-100">
      <ApplicationNavbar
        navigateBack={navigateToWaterRightLandingPage}
        backButtonText="Back to Water Right Landing Page"
        centerText="Water Conservation Estimation Tool"
      />

      <div className="flex-grow-1 overflow-y-auto">
        <div className="h-100 d-flex overflow-y-auto align-items-stretch">
          <div className="estimation-tool-side-panel d-flex flex-column overflow-y-auto">
            <EstimationToolSidebar
              isLoading={isLoadingFundingOrganization || isLoadingApplication}
              loadFailed={fundingOrganizationLoadFailed || applicationLoadFailed}
            />
          </div>

          <div className="flex-grow-1 d-flex flex-column overflow-y-hidden">
            <EstimationToolMapHeader />
            <EstimationToolMap
              waterRightNativeId={waterRightNativeId}
              handleEstimateConsumptiveUseClicked={handleEstimateConsumptiveUseClicked}
              isLoadingConsumptiveUseEstimate={estimateConsumptiveUseMutation.isLoading}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

interface EstimateConsumptiveUseApiCallFields {
  waterConservationApplicationId: string | undefined;
  waterRightNativeId: string | undefined;
  polygonWkts: string[] | undefined;
  compensationRateDollars: number | undefined;
  units: Exclude<CompensationRateUnits, CompensationRateUnits.None> | undefined;
}

const validateFields = (fields: EstimateConsumptiveUseApiCallFields) => {
  const isValid: boolean =
    !!fields.waterConservationApplicationId &&
    !!fields.waterRightNativeId &&
    !!fields.polygonWkts &&
    fields.polygonWkts.length > 0; // compensation rate is optional
  if (!isValid) {
    throw new Error('Invalid fields');
  }
};
