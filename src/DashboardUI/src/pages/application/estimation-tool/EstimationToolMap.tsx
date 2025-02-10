import Map from '../../../components/map/Map';

export function EstimationToolMap() {
  const handleMapDrawnPolygonChange = (polygons: any) => {
    alert('polygons updated');
  };

  return (
    <Map
      handleMapDrawnPolygonChange={handleMapDrawnPolygonChange}
      consumptiveUseAlertEnabled={false}
      geocoderEnabled={false}
    />
  );
}
