import { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import useProgressIndicator from '../../../../hooks/useProgressIndicator';
import { useOverlayDetailsContext } from '../Provider';

export function useAlerts() {
  const {
    hostData: {
      detailsQuery: { isLoading: detailsIsLoading, isError: detailsIsError },
      waterRightInfoListQuery: { isLoading: waterRightInfoIsLoading, isError: waterRightInfoIsError },
      overlayInfoListQuery: {
        isLoading: overlayInfoIsLoading, isError: overlayInfoIsError
      },
    },
  } = useOverlayDetailsContext();

  // Page load initial loading indicator
  useProgressIndicator([
    !detailsIsLoading,
    !overlayInfoIsLoading,
  ], 'Loading Overlay Data');

  // Other loading indicators
  useProgressIndicator([!waterRightInfoIsLoading], 'Loading Water Rights Data');

  const previousErrors = useRef({
    detailsIsError: false,
    overlayInfoIsError: false,
    waterRightInfoIsError: false,
  });

  const handleErrorToast = (isError: boolean, message: string, previousError: boolean) => {
    if (isError && !previousError) {
      toast.error(message, {
        position: 'top-center',
        theme: 'colored',
        autoClose: false,
      });
    }
  };

  useEffect(() => {
    handleErrorToast(detailsIsError, 'Error loading overlay data. Please try again.', previousErrors.current.detailsIsError);
    handleErrorToast(overlayInfoIsError, 'Error loading overlay information. Please try again.', previousErrors.current.overlayInfoIsError);
    handleErrorToast(waterRightInfoIsError, 'Error loading water right information. Please try again.', previousErrors.current.waterRightInfoIsError);

    previousErrors.current = {
      detailsIsError,
      overlayInfoIsError,
      waterRightInfoIsError,
    };
  }, [detailsIsError, overlayInfoIsError, waterRightInfoIsError]);
}
