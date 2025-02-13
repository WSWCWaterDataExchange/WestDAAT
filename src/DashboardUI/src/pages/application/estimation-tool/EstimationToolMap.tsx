import Map from '../../../components/map/Map';

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
    </div>
  );
}
