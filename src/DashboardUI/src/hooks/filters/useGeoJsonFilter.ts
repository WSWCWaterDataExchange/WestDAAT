import { useMemo } from "react";


export function useGeoJsonFilter(areas: GeoJSON.Feature<GeoJSON.Geometry>[] | undefined) {
  const mapFilters = useMemo((): any[] | undefined => {
    if (areas !== undefined && areas.length > 0) {
      //really need https://github.com/mapbox/mapbox-gl-js/issues/9795
      //or https://github.com/mapbox/mapbox-gl-js/pull/10616
      return ["any", ...areas.map(a => ["within", a])];
    }
  }, [areas]);

  return { mapFilters };
}
