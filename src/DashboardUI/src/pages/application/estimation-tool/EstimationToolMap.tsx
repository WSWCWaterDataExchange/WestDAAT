import Map from '../../../components/map/Map';
import { NotImplementedPlaceholder } from '../../../components/NotImplementedAlert';

export function EstimationToolMap() {
  const handleMapDrawnPolygonChange = (polygons: any) => {
    alert('polygons updated');
  };

  return (
    <div className="flex-grow-1">
      <Map
        handleMapDrawnPolygonChange={handleMapDrawnPolygonChange}
        isConsumptiveUseAlertEnabled={false}
        isGeocoderInputFeatureEnabled={false}
      />

      <NotImplementedPlaceholder />
      <NotImplementedPlaceholder />
      <NotImplementedPlaceholder />
      <NotImplementedPlaceholder />
    </div>
  );
}
