import { useCallback, useEffect } from 'react';
import { useGeoJsonFilter } from './useGeoJsonFilter';
import { useMapContext } from '../../../../../contexts/MapProvider';
import { Feature, GeoJsonProperties, Geometry } from 'geojson';

export function usePolylinesFilter() {
  const {
    value: filterPolylines,
    mapFilters,
    setValue: setFilterPolylines,
  } = useGeoJsonFilter('polylines');
  const { setPolylines: setMapPolylines } = useMapContext();

  useEffect(() => {
    setMapPolylines(filterPolylines ?? []);
  }, [filterPolylines, setMapPolylines]);

  const polylinesOnMapUpdated = useCallback(
    (polylines: Feature<Geometry, GeoJsonProperties>[]) => {
      setFilterPolylines(polylines.length > 0 ? polylines : undefined);
    },
    [setFilterPolylines],
  );

  return {
    mapFilters,
    polylinesOnMapUpdate,
  };
}
