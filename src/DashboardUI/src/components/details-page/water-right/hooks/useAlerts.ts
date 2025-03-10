import { useEffect, useMemo, useRef } from 'react';
import useProgressIndicator from '../../../../hooks/useProgressIndicator';
import { toast } from 'react-toastify';
import { useWaterRightDetailsContext } from '../Provider';

export function useAlerts() {
  const {
    hostData: {
      detailsQuery: { isLoading: detailsIsLoading, isError: detailsIsError },
      siteLocationsQuery: { isLoading: siteLocationsIsLoading, isError: siteLocationsIsError },
      siteInfoListQuery: { isLoading: siteInfoListIsLoading, isError: siteInfoListIsError },
      sourceInfoListQuery: { isLoading: sourceInfoListIsLoading, isError: sourceInfoListIsError },
      overlayInfoListQuery: { isLoading: overlayInfoListIsLoading, isError: overlayInfoListIsError },
    },
  } = useWaterRightDetailsContext();

  // Page load initial loading indicator
  useProgressIndicator([
    !detailsIsLoading,
    !siteLocationsIsLoading,
    !siteInfoListIsLoading], 'Loading Water Right Data');

  // Other loading indicators
  useProgressIndicator([!sourceInfoListIsLoading], 'Loading Water Source Info');
  useProgressIndicator([!overlayInfoListIsLoading], 'Loading Overlay Info');

  const previousErrors = useRef({
    detailsError: false,
    locationError: false,
    siteInfoError: false,
    sourceInfoError: false,
    overlayInfoError: false
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
    handleErrorToast(detailsIsError, 'Error loading water right data. Please try again.', previousErrors.current.detailsError);
    handleErrorToast(siteLocationsIsError, 'Error loading water right map. Please try again.', previousErrors.current.locationError);
    handleErrorToast(siteInfoListIsError, 'Error loading site information. Please try again.', previousErrors.current.siteInfoError);
    handleErrorToast(sourceInfoListIsError, 'Error loading water source information. Please try again.', previousErrors.current.sourceInfoError);
    handleErrorToast(overlayInfoListIsError, 'Error loading overlay information. Please try again.', previousErrors.current.overlayInfoError);

    previousErrors.current = {
      detailsError: detailsIsError,
      locationError: siteLocationsIsError,
      siteInfoError: siteInfoListIsError,
      sourceInfoError: sourceInfoListIsError,
      overlayInfoError: overlayInfoListIsError
    };
  }, [
    detailsIsError,
    siteLocationsIsError,
    siteInfoListIsError,
    sourceInfoListIsError,
    overlayInfoListIsError
  ]);
}
