import { useConservationApplicationContext } from '../../../../contexts/ConservationApplicationProvider';
import { EstimationToolSidebar } from '../../estimation-tool/EstimationToolSidebar';
import { EstimationToolMapHeader } from '../../estimation-tool/EstimationToolMapHeader';
import ReviewMap from './ReviewMap';
import { useReviewerEstimateConsumptiveUseMutation } from '../../../../hooks/queries/useApplicationQuery';

export function ApplicationReviewMapPage() {
  const { state } = useConservationApplicationContext();

  const estimateConsumptiveUseMutation = useReviewerEstimateConsumptiveUseMutation();

  const handleEstimateConsumptiveUseClicked = async (updateEstimate: boolean) => {
    await estimateConsumptiveUseMutation.mutateAsync({
      updateEstimate,
    });
  };

  return (
    <div className="flex-grow-1 overflow-y-auto">
      <hr className="m-0" />
      <div className="h-100 d-flex overflow-y-auto align-items-stretch">
        <div className="estimation-tool-side-panel d-flex flex-column overflow-y-auto">
          <EstimationToolSidebar
            perspective="reviewer"
            isLoading={state.isLoadingApplication || state.isLoadingFundingOrganization}
            loadFailed={state.loadApplicationErrored || state.loadFundingOrganizationErrored}
          />
        </div>

        <div className="flex-grow-1 d-flex flex-column overflow-y-hidden">
          <EstimationToolMapHeader />
          <ReviewMap
            waterRightNativeId={state.conservationApplication.waterRightNativeId}
            handleEstimateConsumptiveUseClicked={handleEstimateConsumptiveUseClicked}
            isLoadingConsumptiveUseEstimate={state.reviewerEstimateConsumptiveUseMutationStatus.isLoading}
          />
        </div>
      </div>
    </div>
  );
}
