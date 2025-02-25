import { useEffect, useMemo } from 'react';
import useProgressIndicator from '../../../../hooks/useProgressIndicator';
import { toast } from 'react-toastify';
import { useWaterRightDetailsContext } from '../Provider';

export function useAlerts() {
  const {
    hostData: {
      detailsQuery: {isLoading: detailsIsLoading, isError: detailsIsError},
      siteLocationsQuery: {isLoading: siteLocationsIsLoading, isError: siteLocationsIsError},
      siteInfoListQuery: {isLoading: siteInfoListIsLoading, isError: siteInfoListIsError},
      sourceInfoListQuery: {isLoading: sourceInfoListIsLoading, isError: sourceInfoListIsError},
      waterRightsInfoListQuery: {isLoading: waterRightsInfoListIsLoading, isError: waterRightsInfoListIsError},
      timeSeriesInfoListQuery: {isLoading: timeSeriesInfoListIsLoading, isError: timeSeriesInfoListIsError}
    },
  } = useWaterRightDetailsContext();

  const isError = useMemo(() => {
    return detailsIsError || siteLocationsIsError || siteInfoListIsError || sourceInfoListIsError || waterRightsInfoListIsError || timeSeriesInfoListIsError;
  }, [ detailsIsError, siteLocationsIsError, siteInfoListIsError, sourceInfoListIsError, waterRightsInfoListIsError, timeSeriesInfoListIsError ]);

  useProgressIndicator(
    [ !detailsIsLoading, !siteLocationsIsLoading, !siteInfoListIsLoading, !sourceInfoListIsLoading, !waterRightsInfoListIsLoading, !timeSeriesInfoListIsLoading ],
    'Loading Water Right Data',
  );

  useEffect(() => {
    if (isError) {
      toast.error('Error loading water right data.  Please try again.', {
        position: 'top-center',
        theme: 'colored',
        autoClose: false,
      });
    }
  }, [ isError ]);
}
