import { useEffect, useRef } from 'react';
import { useSiteDetailsContext } from '../Provider';
import useProgressIndicator from '../../../../hooks/useProgressIndicator';
import { toast } from 'react-toastify';

export function useAlerts() {
  const {
    hostData: {
      detailsQuery: { isLoading: detailsIsLoading, isError: detailsIsError },
      locationsQuery: { isLoading: locationsIsLoading, isError: locationsIsError },
      waterRightInfoListQuery: { isLoading: waterRightInfoListIsLoading, isError: waterRightInfoListIsError },
      sourceInfoListQuery: { isLoading: sourceInfoListIsLoading, isError: sourceInfoListIsError },
      siteUsageQuery: { isLoading: siteUsageIsLoading, isError: siteUsageIsError },
      variableInfoListQuery: { isLoading: variableInfoListIsLoading, isError: variableInfoListIsError },
      methodInfoListQuery: { isLoading: methodInfoListIsLoading, isError: methodInfoListIsError },
      timeSeriesInfoListQuery: { isLoading: timeSeriesInfoListIsLoading, isError: timeSeriesInfoListIsError },
    },
  } = useSiteDetailsContext();

  // Page load initial loading indicator
  useProgressIndicator(
    [
      !detailsIsLoading,
      !locationsIsLoading,
      !sourceInfoListIsLoading,
      !siteUsageIsLoading,
    ],
    'Loading Site Data',
  );

  // Other loading indicators
  useProgressIndicator([!waterRightInfoListIsLoading], 'Loading Water Right Data',);
  useProgressIndicator([!methodInfoListIsLoading], 'Loading Method Data',);
  useProgressIndicator([!variableInfoListIsLoading], 'Loading Variable Data',);
  useProgressIndicator([!timeSeriesInfoListIsLoading], 'Loading Time Series Data',);

  const previousErrors = useRef({
    detailsIsError: false,
    locationsIsError: false,
    waterRightInfoListIsError: false,
    sourceInfoListIsError: false,
    siteUsageIsError: false,
    variableInfoListIsError: false,
    methodInfoListIsError: false,
    timeSeriesInfoListIsError: false,
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
    handleErrorToast(detailsIsError, 'Error loading site data. Please try again.', previousErrors.current.detailsIsError);
    handleErrorToast(locationsIsError, 'Error loading site location. Please try again.', previousErrors.current.locationsIsError);
    handleErrorToast(waterRightInfoListIsError, 'Error loading water right information. Please try again.', previousErrors.current.waterRightInfoListIsError);
    handleErrorToast(sourceInfoListIsError, 'Error loading water source information. Please try again.', previousErrors.current.sourceInfoListIsError);
    handleErrorToast(siteUsageIsError, 'Error loading time series graph. Please try again.', previousErrors.current.siteUsageIsError);
    handleErrorToast(variableInfoListIsError, 'Error loading variable information. Please try again.', previousErrors.current.variableInfoListIsError);
    handleErrorToast(methodInfoListIsError, 'Error loading method information. Please try again.', previousErrors.current.methodInfoListIsError);
    handleErrorToast(timeSeriesInfoListIsError, 'Error loading time series information. Please try again.', previousErrors.current.timeSeriesInfoListIsError);

    previousErrors.current = {
      detailsIsError,
      locationsIsError,
      waterRightInfoListIsError,
      sourceInfoListIsError,
      siteUsageIsError,
      variableInfoListIsError,
      methodInfoListIsError,
      timeSeriesInfoListIsError,
    };
  }, [
    detailsIsError,
    locationsIsError,
    waterRightInfoListIsError,
    sourceInfoListIsError,
    siteUsageIsError,
    variableInfoListIsError,
    methodInfoListIsError,
    timeSeriesInfoListIsError,
  ]);
}
