import { useMemo } from "react";


export function useGeoJsonFilter(areas: GeoJSON.Feature<GeoJSON.Geometry>[] | undefined) {
  const mapFilters = useMemo((): any[] | undefined => {
    if (areas !== undefined && areas.length > 0) {
      return ["any", ...areas.map(a => ["within", a])];
    }
  }, [areas]);

  return { mapFilters };
}
