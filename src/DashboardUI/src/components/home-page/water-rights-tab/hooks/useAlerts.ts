import { useEffect, useMemo } from "react";
import { useNldiPinDropAlert, useNoMapResults } from "../../../../hooks/useMapAlert";
import { useWaterRightsContext } from "../Provider";
import useProgressIndicator from "../../../../hooks/useProgressIndicator";
import { useNldiFilter } from "./filters/useNldiFilter";
import { useRiverBasinFilter } from "./filters/useRiverBasinFilter";
import { toast } from "react-toastify";
import { useMapFitRequested } from "./useMapFitRequested";

export function useAlerts(){
  const {
    state: {
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
  } = useWaterRightsContext();

  const {isNldiFilterActive, nldiFeaturesQuery: {isLoading: isNldiDataLoading, isError: isNldiDataError}, nldiFilterData: {latitude, longitude} = {}} = useNldiFilter();
  const {riverBasinPolygonsQuery: {isLoading: isRiverBasinPolygonLoading, isError: isRiverBasinPolygonError}} = useRiverBasinFilter();
  const {isLoading: isFilterEnvelopeLoading, isError: isFilterEnvelopeError} = useMapFitRequested()

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
  useProgressIndicator([!isFilterEnvelopeLoading], "Finding Water Right Locations");

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
  useEffect(() => {
    if(isFilterEnvelopeError){
      toast.error("Unable to find water right locations",
      {
        position: toast.POSITION.TOP_CENTER,
        theme: 'colored',
        autoClose: 3000
      })
    }
  }, [isFilterEnvelopeError])
  useNoMapResults(isLoaded);
}