import { useEffect, useMemo } from 'react';
import { useSiteDetailsContext } from '../Provider';
import useProgressIndicator from '../../../../hooks/useProgressIndicator';
import { toast } from 'react-toastify';

export function useAlerts() {
  const {
    hostData: {
      detailsQuery: { isLoading: detailsIsLoading, isError: detailsIsError },
      locationsQuery: {
        isLoading: locationsIsLoading,
        isError: locationsIsError,
      },
      waterRightInfoListQuery: {
        isLoading: waterRightInfoListIsLoading,
        isError: waterRightInfoListIsError,
      },
      sourceInfoListQuery: {
        isLoading: sourceInfoListIsLoading,
        isError: sourceInfoListIsError,
      },
    },
  } = useSiteDetailsContext();

  const isError = useMemo(() => {
    return (
      detailsIsError ||
      locationsIsError ||
      waterRightInfoListIsError ||
      sourceInfoListIsError
    );
  }, [
    detailsIsError,
    locationsIsError,
    waterRightInfoListIsError,
    sourceInfoListIsError,
  ]);

  useProgressIndicator(
    [
      !detailsIsLoading,
      !locationsIsLoading,
      !waterRightInfoListIsLoading,
      !sourceInfoListIsLoading,
    ],
    'Loading Site Data',
  );

  useEffect(() => {
    if (isError) {
      toast.error('Error loading site data.  Please try again.', {
        position: toast.POSITION.TOP_CENTER,
        theme: 'colored',
        autoClose: false,
      });
    }
  }, [isError]);
}
