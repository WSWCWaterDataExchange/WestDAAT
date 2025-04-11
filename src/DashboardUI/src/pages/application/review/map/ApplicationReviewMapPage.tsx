import { useMutation } from 'react-query';
import { useConservationApplicationContext } from '../../../../contexts/ConservationApplicationProvider';
import { EstimationToolSidebar } from '../../estimation-tool/EstimationToolSidebar';
import { EstimationToolMapHeader } from '../../estimation-tool/EstimationToolMapHeader';
import ReviewMap from './ReviewMap';
import { reviewerEstimateConsumptiveUse } from '../../../../accessors/applicationAccessor';
import { MapPolygon } from '../../../../data-contracts/MapPolygon';
import { useMsal } from '@azure/msal-react';
import { ReviewerEstimateConsumptiveUseResponse } from '../../../../data-contracts/ReviewerEstimateConsumptiveUseResponse';
import { toast } from 'react-toastify';

export function ApplicationReviewMapPage() {
  const { state } = useConservationApplicationContext();
  const msalContext = useMsal();

  const estimateConsumptiveUseMutation = useMutation({
    mutationFn: async (options: { updateEstimate: boolean }) => {
      const apiCallFields: Parameters<typeof reviewerEstimateConsumptiveUse>[1] = {
        waterConservationApplicationId: state.conservationApplication.waterConservationApplicationId!,
        polygons: state.conservationApplication.estimateLocations.map(
          (polygon): MapPolygon => ({
            waterConservationApplicationEstimateLocationId:
              polygon.waterConservationApplicationEstimateLocationId ?? null,
            polygonWkt: polygon.polygonWkt!,
            drawToolType: polygon.drawToolType!,
          }),
        ),
        controlLocation: {
          pointWkt: state.conservationApplication.controlLocation!.pointWkt!,
        },
        updateEstimate: options.updateEstimate,
      };

      return await reviewerEstimateConsumptiveUse(msalContext, apiCallFields);
    },
    onSuccess: (result: ReviewerEstimateConsumptiveUseResponse) => {
      if (result) {
        // todo: dispatch
      }
    },
    onError: (error: Error) => {
      toast.error('Failed to estimate consumptive use. Please try again later.');
    },
  });

  const handleEstimateConsumptiveUseClicked = async () => {
    await estimateConsumptiveUseMutation.mutateAsync({
      // todo: pass in the correct value
      updateEstimate: false,
    });
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
