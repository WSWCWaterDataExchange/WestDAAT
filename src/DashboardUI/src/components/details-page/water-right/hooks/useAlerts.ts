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
      overlayInfoListQuery: { isLoading: waterRightsInfoListIsLoading, isError: waterRightsInfoListIsError },
    },
  } = useWaterRightDetailsContext();

  const previousErrors = useRef({
    detailsError: false,
    locationError: false,
    siteInfoError: false,
    sourceInfoError: false,
    waterRightsInfoError: false
  });

  // Page load initial loading indicator
  useProgressIndicator([
    !detailsIsLoading,
    !siteLocationsIsLoading,
    !siteInfoListIsLoading], 'Loading Water Right Data');

  // Other loading indicators
  useProgressIndicator([!sourceInfoListIsLoading], 'Loading Water Right Source Info');
  useProgressIndicator([!waterRightsInfoListIsLoading], 'Loading Water Right Rights Info');

  const isError = useMemo(() => {
    return detailsIsError || siteLocationsIsError || siteInfoListIsError || sourceInfoListIsError || waterRightsInfoListIsError;
  }, [detailsIsError, siteLocationsIsError, siteInfoListIsError, sourceInfoListIsError, waterRightsInfoListIsError]);

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
    handleErrorToast(isError, 'Error loading water right data. Please try again.', previousErrors.current.detailsError);
    handleErrorToast(isError, 'Error loading water right map. Please try again.', previousErrors.current.locationError);
    handleErrorToast(isError, 'Error loading water right site info. Please try again.', previousErrors.current.siteInfoError);
    handleErrorToast(isError, 'Error loading water source info. Please try again.', previousErrors.current.sourceInfoError);
    handleErrorToast(isError, 'Error loading water right rights info. Please try again.', previousErrors.current.waterRightsInfoError);

    previousErrors.current = {
      detailsError: detailsIsError,
      locationError: siteLocationsIsError,
      siteInfoError: siteInfoListIsError,
      sourceInfoError: sourceInfoListIsError,
      waterRightsInfoError: waterRightsInfoListIsError
    };
  }, [
    detailsIsError,
    siteLocationsIsError,
    siteInfoListIsError,
    sourceInfoListIsError,
    waterRightsInfoListIsError
  ]);
}
