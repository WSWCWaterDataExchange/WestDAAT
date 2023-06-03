import { useEffect } from "react";
import { useMapContext, defaultMapLocationData, defaultMapStyle } from "../../../contexts/MapProvider";
import { useUrlParameters } from "../../../hooks/url-parameters/useUrlParameters";
import urlParameterKeys from "../../../hooks/url-parameters/urlParameterKeys";
import { useFiltersUrlParameters } from "../water-rights-tab/hooks/url-parameters/useFiltersUrlParameters";

export function useMapUrlParameters() {
  const {
    isMapLoaded,
    mapLocationSettings,
    mapStyle,
    setMapLocationSettings,
    setMapStyle,
    setPolylines
  } = useMapContext();
  const {getParameter: getMapLocationParameter, setParameter: setMapLocationParameter} = useUrlParameters(urlParameterKeys.homePage.map, defaultMapLocationData);
  const {getParameter: getMapStyleParameter, setParameter: setMapStyleParameter} = useUrlParameters(urlParameterKeys.homePage.mapStyle, defaultMapStyle);
  const {getParameter: getFiltersUrlParameter} = useFiltersUrlParameters();

  useEffect(() =>{
      setMapLocationSettings(getMapLocationParameter() ?? defaultMapLocationData);
      setMapStyle(getMapStyleParameter() ?? defaultMapStyle);
      const parameterFilters = getFiltersUrlParameter();
      setPolylines(parameterFilters?.polylines ?? []);
  }, [getMapLocationParameter, getMapStyleParameter, setMapLocationSettings, setMapStyle, setPolylines, getFiltersUrlParameter])

  useEffect(() => {
    setMapLocationParameter(mapLocationSettings ?? defaultMapLocationData)
  }, [isMapLoaded, mapLocationSettings, setMapLocationParameter])

  useEffect(() => {
    setMapStyleParameter(mapStyle ?? defaultMapStyle);
  }, [isMapLoaded, mapStyle, setMapStyleParameter])
}