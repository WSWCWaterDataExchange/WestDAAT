import { useMapFitRequested } from '../../../components/home-page/water-rights-tab/map-options/hooks/useMapFitRequested';
import { usePolylinesFilter } from '../../../components/home-page/water-rights-tab/map-options/hooks/usePolylinesFilter';
import Map from '../../../components/map/Map';

export function EstimationToolMap() {
  const { polylinesOnMapUpdated } = usePolylinesFilter();
  const { handleMapFitRequested } = useMapFitRequested();

  return (
    <Map
      consumptiveUseAlertEnabled={false}
      handleMapDrawnPolygonChange={polylinesOnMapUpdated}
      handleMapFitChange={handleMapFitRequested}
      geocoderEnabled={false}
    />
  );
}
