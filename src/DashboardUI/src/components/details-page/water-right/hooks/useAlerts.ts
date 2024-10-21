import { useEffect, useMemo } from 'react';
import useProgressIndicator from '../../../../hooks/useProgressIndicator';
import { toast } from 'react-toastify';
import { useWaterRightDetailsContext } from '../Provider';

export function useAlerts() {
  const {
    hostData: {
      detailsQuery: { isLoading: detailsIsLoading, isError: detailsIsError },
      siteLocationsQuery: {
        isLoading: siteLocationsIsLoading,
        isError: siteLocationsIsError,
      },
      siteInfoListQuery: {
        isLoading: siteInfoListIsLoading,
        isError: siteInfoListIsErro,
      },
      sourceInfoListQuery: {
        isLoading: sourceInfoListIsLoading,
        isError: sourceInfoListIsError,
      },
    },
  } = useWaterRightDetailsContext();

  const isError = useMemo(() => {
    return (
      detailsIsError ||
      siteLocationsIsError ||
      siteInfoListIsError ||
      sourceInfoListIsError
    );
  }, [
    detailsIsError,
    siteLocationsIsError,
    siteInfoListIsError,
    sourceInfoListIsErro,
  ]);

  useProgressIndicator(
    [
      !detailsIsLoading,
      !siteLocationsIsLoading,
      !siteInfoListIsLoading,
      !sourceInfoListIsLoading,
    ],
    'Loading Water Right Data',
  );

  useEffect(() => {
    if (isError) {
      toast.error('Error loading water right data.  Please try again.', {
        position: toast.POSITION.TOP_CENTER,
        theme: 'colored',
        autoClose: false,
      });
    }
  }, [isError]);
}
