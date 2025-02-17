import { useEffect, useRef } from 'react';
import { useMapContext, defaultMapLocationData, defaultMapStyle } from '../../../contexts/MapProvider';
import { useUrlParameters } from '../../../hooks/url-parameters/useUrlParameters';
import urlParameterKeys from '../../../hooks/url-parameters/urlParameterKeys';
import { useFiltersUrlParameters } from '../water-rights-tab/map-options/hooks/useFiltersUrlParameters';

export function useMapUrlParameters() {
  const { isMapLoaded, mapLocationSettings, mapStyle, setMapLocationSettings, setMapStyle, setPolylines } =
    useMapContext();

  const { getParameter: getMapLocationParameter, setParameter: setMapLocationParameter } = useUrlParameters(
    urlParameterKeys.homePage.map,
    defaultMapLocationData,
  );

  const { getParameter: getMapStyleParameter, setParameter: setMapStyleParameter } = useUrlParameters(
    urlParameterKeys.homePage.mapStyle,
    defaultMapStyle,
  );

  const { getParameter: getFiltersUrlParameter } = useFiltersUrlParameters();

  const didInitialLoad = useRef(false);

  useEffect(() => {
    if (didInitialLoad.current) return;

    const locationParams = getMapLocationParameter();
    const styleParam = getMapStyleParameter();
    const parameterFilters = getFiltersUrlParameter();

    setMapLocationSettings(locationParams ?? defaultMapLocationData);
    setMapStyle(styleParam ?? defaultMapStyle);
    setPolylines(parameterFilters?.polylines ?? []);

    didInitialLoad.current = true;
  }, []);

  useEffect(() => {
    if (!isMapLoaded || !didInitialLoad.current) return;
    if (!mapLocationSettings) return;

    setMapLocationParameter({
      latitude: mapLocationSettings.latitude,
      longitude: mapLocationSettings.longitude,
      zoomLevel: mapLocationSettings.zoomLevel,
    });
  }, [isMapLoaded, mapLocationSettings, setMapLocationParameter]);

  useEffect(() => {
    if (!isMapLoaded || !didInitialLoad.current) return;
    setMapStyleParameter(mapStyle ?? defaultMapStyle);
  }, [isMapLoaded, mapStyle, setMapStyleParameter]);
}
