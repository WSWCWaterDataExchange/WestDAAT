import { useContext, useEffect, useMemo } from "react";
import useProgressIndicator from "../../../../hooks/useProgressIndicator";
import { toast } from "react-toastify";
import { WaterRightDetailsContext } from "../Provider";

export function useAlerts(){
  const {
    hostData: {
      detailsQuery: {
        isLoading: detailsIsLoading,
        isError: detailsIsError
      },
      siteLocationsQuery: {
        isLoading: siteLocationsIsLoading,
        isError: siteLocationsIsError
      },
      siteInfoListQuery: {
        isLoading: siteInfoListIsLoading,
        isError: siteInfoListIsError
      },
      sourceInfoListQuery: {
        isLoading: sourceInfoListIsLoading,
        isError: sourceInfoListIsError
      }
    }
  } = useContext(WaterRightDetailsContext);

  const isError = useMemo(() =>{
    return detailsIsError ||
           siteLocationsIsError ||
           siteInfoListIsError ||
           sourceInfoListIsError
  }, [detailsIsError, siteLocationsIsError, siteInfoListIsError, sourceInfoListIsError])
  
  useProgressIndicator(
    [
      !detailsIsLoading,
      !siteLocationsIsLoading,
      !siteInfoListIsLoading,
      !sourceInfoListIsLoading
    ], "Loading Water Right Data");

  useEffect(() =>{
    if(isError){
      toast.error("Error loading water right data.  Please try again.",
      {
        position: toast.POSITION.TOP_CENTER,
        theme: 'colored',
        autoClose: false
      })
    }
  }, [isError])
}