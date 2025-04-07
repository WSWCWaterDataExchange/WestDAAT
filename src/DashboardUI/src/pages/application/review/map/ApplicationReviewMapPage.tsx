import { useMutation } from 'react-query';
import { useConservationApplicationContext } from '../../../../contexts/ConservationApplicationProvider';
import { EstimationToolSidebar } from '../../estimation-tool/EstimationToolSidebar';
import { EstimationToolMapHeader } from '../../estimation-tool/EstimationToolMapHeader';
import ReviewMap from './ReviewMap';
import { reviewerEstimateConsumptiveUse } from '../../../../accessors/applicationAccessor';
import { useMsal } from '@azure/msal-react';
import { MapPolygon } from '../../../../data-contracts/MapPolygon';
import { ReviewerEstimateConsumptiveUseResponse } from '../../../../data-contracts/ReviewerEstimateConsumptiveUseResponse';
import { toast } from 'react-toastify';

export function ApplicationReviewMapPage() {
  const context = useMsal();
  const { state, dispatch } = useConservationApplicationContext();

  const estimateConsumptiveUseMutation = useMutation({
    mutationFn: async (overwriteEstimate: boolean) => {
      const fields: Parameters<typeof reviewerEstimateConsumptiveUse>[1] = {
        waterConservationApplicationId: state.conservationApplication.waterConservationApplicationId!,
        polygons: state.conservationApplication.estimateLocations.map(
          (polygon): MapPolygon => ({
            polygonWkt: polygon.polygonWkt!,
            drawToolType: polygon.drawToolType!,
          }),
        ),
        controlLocation: {
          pointWkt: 'POINT (-106.1264 34.9799)',
        },
        overwriteEstimate: overwriteEstimate,
      };

      validateFields(fields);

      return await reviewerEstimateConsumptiveUse(context, fields);
    },
    onSuccess: (result: ReviewerEstimateConsumptiveUseResponse) => {
      toast.success('Consumptive use estimate successfully calculated.');
      console.log(result);
    },
    onError: (error: Error) => {
      toast.error('Failed to calculate consumptive use estimate.');
    },
  });

  const handleEstimateConsumptiveUseClicked = async () => {
    await estimateConsumptiveUseMutation.mutateAsync(false);
  };

  return (
    <div className="flex-grow-1 overflow-y-auto">
      <hr className="m-0" />
      <div className="h-100 d-flex overflow-y-auto align-items-stretch">
        <div className="estimation-tool-side-panel d-flex flex-column overflow-y-auto">
          <EstimationToolSidebar
            isLoading={state.isLoadingApplication || state.isLoadingFundingOrganization}
            loadFailed={state.loadApplicationErrored || state.loadFundingOrganizationErrored}
          />
        </div>

        <div className="flex-grow-1 d-flex flex-column overflow-y-hidden">
          <EstimationToolMapHeader />
          <ReviewMap
            waterRightNativeId={state.conservationApplication.waterRightNativeId}
            handleEstimateConsumptiveUseClicked={handleEstimateConsumptiveUseClicked}
            isLoadingConsumptiveUseEstimate={estimateConsumptiveUseMutation.isLoading}
          />
        </div>
      </div>
    </div>
  );
}

const validateFields = (fields: Parameters<typeof reviewerEstimateConsumptiveUse>[1]) => {
  const isValid: boolean =
    !!fields.waterConservationApplicationId &&
    !!fields.polygons &&
    fields.polygons.length > 0 &&
    fields.polygons.every((polygon) => !!polygon.polygonWkt && !!polygon.drawToolType) &&
    !!fields.controlLocation &&
    !!fields.controlLocation.pointWkt;

  if (!isValid) {
    throw new Error('Invalid fields');
  }
};
