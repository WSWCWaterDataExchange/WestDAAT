import { useMutation } from 'react-query';
import { EstimationToolMap } from '../../estimation-tool/EstimationToolMap';
import { EstimationToolMapHeader } from '../../estimation-tool/EstimationToolMapHeader';
import { EstimationToolSidebar } from '../../estimation-tool/EstimationToolSidebar';

export interface ApplicationReviewMapProps {
  isApplicationLoading: boolean;
  isFundingOrganizationLoading: boolean;
  waterRightNativeId: string | undefined;
}

export function ApplicationReviewMap(props: ApplicationReviewMapProps) {
  const estimateConsumptiveUseMutation = useMutation({
    mutationFn: async () => {
      alert('Not implemented. This feature will be available in a future release.');
      return;
    },
  });

  const handleEstimateConsumptiveUseClicked = async () => {
    await estimateConsumptiveUseMutation.mutateAsync();
  };

  return (
    <div className="flex-grow-1 overflow-y-auto">
      <hr className="m-0" />
      <div className="h-100 d-flex overflow-y-auto align-items-stretch">
        <div className="estimation-tool-side-panel d-flex flex-column overflow-y-auto">
          <EstimationToolSidebar
            isLoading={props.isApplicationLoading || props.isFundingOrganizationLoading}
            loadFailed={false}
          />
        </div>

        <div className="flex-grow-1 d-flex flex-column overflow-y-hidden">
          <EstimationToolMapHeader />
          <EstimationToolMap
            waterRightNativeId={props.waterRightNativeId}
            handleEstimateConsumptiveUseClicked={handleEstimateConsumptiveUseClicked}
            isLoadingConsumptiveUseEstimate={estimateConsumptiveUseMutation.isLoading}
          />
        </div>
      </div>
    </div>
  );
}
