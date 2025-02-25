import { useEffect, useMemo } from 'react';
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

  const isError = useMemo(() => {
    return detailsIsError ||
      locationsIsError ||
      waterRightInfoListIsError ||
      sourceInfoListIsError ||
      siteUsageIsError ||
      variableInfoListIsError ||
      methodInfoListIsError ||
      timeSeriesInfoListIsError;
  }, [
    detailsIsError,
    locationsIsError,
    waterRightInfoListIsError,
    sourceInfoListIsError,
    siteUsageIsError,
    variableInfoListIsError,
    methodInfoListIsError,
    timeSeriesInfoListIsError
  ]);

  useProgressIndicator(
    [
      !detailsIsLoading,
      !locationsIsLoading,
      !waterRightInfoListIsLoading,
      !sourceInfoListIsLoading,
      !siteUsageIsLoading,
      !variableInfoListIsLoading,
      !methodInfoListIsLoading,
      !timeSeriesInfoListIsLoading
    ],
    'Loading Site Data',
  );

  useEffect(() => {
    if (isError) {
      toast.error('Error loading site data.  Please try again.', {
        position: 'top-center',
        theme: 'colored',
        autoClose: false,
      });
    }
  }, [isError]);
}
