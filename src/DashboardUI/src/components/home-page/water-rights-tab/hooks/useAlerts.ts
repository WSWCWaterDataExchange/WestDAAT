import { useContext, useEffect, useMemo } from "react";
import { useNldiPinDropAlert, useNoMapResults } from "../../../../hooks/useMapAlert";
import { WaterRightsContext } from "../Provider";
import useProgressIndicator from "../../../../hooks/useProgressIndicator";
import { useNldiFilter } from "./filters/useNldiFilter";
import { useRiverBasinFilter } from "./filters/useRiverBasinFilter";
import { toast } from "react-toastify";

export function useAlerts(){
  const {
    hostData: {
      beneficialUsesQuery: {
        isLoading: beneficialUseIsLoading,
        isError: beneficialUseIsError
      },
      waterSourcesQuery: {
        isLoading: waterSourcesIsLoading,
        isError: waterSourcesIsError
      },
      ownerClassificationsQuery: {
        isLoading: ownerClassificationsIsLoading,
        isError: ownerClassificationsIsError
      },
      riverBasinsQuery: {
        isLoading: riverBasinsIsLoading,
        isError: riverBasinsIsError
      },
      statesQuery: {
        isLoading: statesIsLoading,
        isError: statesIsError
      }
    }
  } = useContext(WaterRightsContext);

  const {isNldiFilterActive, nldiFeaturesQuery: {isLoading: isNldiDataLoading, isError: isNldiDataError}, nldiFilterData: {latitude, longitude} = {}} = useNldiFilter();
  const {riverBasinPolygonsQuery: {isLoading: isRiverBasinPolygonLoading, isError: isRiverBasinPolygonError}} = useRiverBasinFilter();

  const isLoaded = useMemo(() =>{
    return !(beneficialUseIsLoading ||
             waterSourcesIsLoading ||
             ownerClassificationsIsLoading ||
             riverBasinsIsLoading ||
             statesIsLoading ||
             isNldiDataLoading)
  }, [beneficialUseIsLoading, ownerClassificationsIsLoading, riverBasinsIsLoading, statesIsLoading, waterSourcesIsLoading, isNldiDataLoading]);

  const isError = useMemo(() =>{
    return beneficialUseIsError ||
           waterSourcesIsError ||
           ownerClassificationsIsError ||
           riverBasinsIsError ||
           statesIsError ||
           isNldiDataError ||
           isRiverBasinPolygonError
  }, [beneficialUseIsError, ownerClassificationsIsError, riverBasinsIsError, isRiverBasinPolygonError, statesIsError, waterSourcesIsError, isNldiDataError])

  const needsToSetNldiLocation = useMemo(() => {
    return isNldiFilterActive && (!latitude || !longitude)
  }, [isNldiFilterActive, latitude, longitude])
  
  useProgressIndicator(
    [
      !beneficialUseIsLoading,
      !ownerClassificationsIsLoading,
      !riverBasinsIsLoading,
      !statesIsLoading,
      !waterSourcesIsLoading
    ], "Loading Filter Data");

  useProgressIndicator([!isNldiDataLoading], "Loading NLDI Data");
  useProgressIndicator([!isRiverBasinPolygonLoading], "Loading River Basin Data");

  useNldiPinDropAlert(needsToSetNldiLocation);
  useEffect(() =>{
    if(isError){
      toast.error("Error loading water rights data.  Please try again.",
      {
        position: toast.POSITION.TOP_CENTER,
        theme: 'colored',
        autoClose: false
      })
    }
  }, [isError])
  useNoMapResults(isLoaded);
}