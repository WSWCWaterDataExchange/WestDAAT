import React, { useCallback, useEffect, useMemo } from 'react';
import { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';
import { useWaterRightsContext } from '../../Provider';
import { useRiverBasinPolygons } from '../../../../../hooks/queries/useSystemQuery';
import { useGeoJsonFilter } from '../../../../../hooks/filters/useGeoJsonFilter';
import { useMapContext } from '../../../../../contexts/MapProvider';
import { mapSourceNames } from '../../../../../config/maps';
import { useDebounce } from '@react-hook/debounce';

const emptyGeoJsonData: FeatureCollection<Geometry, GeoJsonProperties> = {
  type: 'FeatureCollection',
  features: [],
};
export function useRiverBasinFilter() {
  const { setGeoJsonData } = useMapContext();
  const {
    filters: { riverBasinNames: rbn },
    setFilters,
  } = useWaterRightsContext();

  const riverBasinNames = useMemo(() => {
    return rbn ?? [];
  }, [rbn]);

  const hasRiverBasinNames = useMemo(() => {
    return riverBasinNames.length > 0;
  }, [riverBasinNames.length]);

  const [debouncedRiverBasinNames] = useDebounce(riverBasinNames, 500);
  const riverBasinPolygonsQuery = useRiverBasinPolygons(
    debouncedRiverBasinNames,
  );
  const riverBasinPolygons = useMemo(() => {
    if (!hasRiverBasinNames) return emptyGeoJsonData;
    return riverBasinPolygonsQuery.data ?? emptyGeoJsonData;
  }, [riverBasinPolygonsQuery.data, hasRiverBasinNames]);

  const { mapFilters } = useGeoJsonFilter(riverBasinPolygons.features);

  useEffect(() => {
    setGeoJsonData(mapSourceNames.riverBasinsGeoJson, riverBasinPolygons);
  });

  const setRiverBasinNames = useCallback(
    (riverBasinNames: string[] | undefined) => {
      setFilters((s) => ({
        ...s,
        riverBasinNames:
          riverBasinNames === undefined || riverBasinNames.length === 0
            ? undefined
            : [...new Set(riverBasinNames)],
      }));
    },
    [setFilters],
  );

  return {
    riverBasinNames,
    mapFilters,
    riverBasinPolygonsQuery,
    setRiverBasinNames,
  };
}
