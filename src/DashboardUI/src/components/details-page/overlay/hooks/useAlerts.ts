import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import useProgressIndicator from '../../../../hooks/useProgressIndicator';
import { useOverlayDetailsContext } from '../Provider';

export function useAlerts() {
  const {
    hostData: {
      detailsQuery: { isLoading: detailsIsLoading, isError: detailsIsError },
      overlayInfoListQuery: { isLoading: overlayInfoListIsLoading, isError: overlayInfoListIsError },
      waterRightsInfoListByReportingUnitQuery: {
        isLoading: waterRightsInfoListByReportingUnitIsLoading,
        isError: waterRightsInfoListByReportingUnitIsError
      },
      waterRightsInfoListByAllocationQuery: {
        isLoading: waterRightsInfoListByAllocationIsLoading,
        isError: waterRightsInfoListByAllocationIsError
      }
    },
  } = useOverlayDetailsContext();

  const isError = useMemo(() => {
    return detailsIsError ||
      overlayInfoListIsError ||
      waterRightsInfoListByReportingUnitIsError ||
      waterRightsInfoListByAllocationIsError;
  }, [detailsIsError]);

  useProgressIndicator([
    !detailsIsLoading,
    !overlayInfoListIsLoading,
    !waterRightsInfoListByReportingUnitIsLoading,
    !waterRightsInfoListByAllocationIsLoading
  ], 'Loading Overlay Data');

  useEffect(() => {
    if (isError) {
      toast.error('Error loading overlay data. Please try again.', {
        position: 'top-center',
        theme: 'colored',
        autoClose: false,
      });
    }
  }, [isError]);
}
