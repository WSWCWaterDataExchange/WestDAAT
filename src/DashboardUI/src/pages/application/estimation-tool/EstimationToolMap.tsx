import { Feature, GeoJsonProperties, Geometry } from 'geojson';
import Map from '../../../components/map/Map';
import { EstimationFormMapPolygon } from '../../../data-contracts/EstimationFormMapPolygon';
import { convertGeometryToWkt } from '../../../utilities/geometryWktConverter';
import { area as areaInSquareMeters } from '@turf/area';
import { useConservationApplicationContext } from '../../../contexts/ConservationApplicationProvider';

export function EstimationToolMap() {
  const { dispatch } = useConservationApplicationContext();

  const handleMapDrawnPolygonChange = (polygons: Feature<Geometry, GeoJsonProperties>[]) => {
    const polygonData: EstimationFormMapPolygon[] = polygons.map((polygonFeature) => ({
      polygonWkt: convertGeometryToWkt(polygonFeature.geometry),
      acreage: convertSquareMetersToAcres(areaInSquareMeters(polygonFeature)),
    }));

    dispatch({
      type: 'MAP_SELECTED_POLYGONS_UPDATED',
      payload: {
        polygons: polygonData,
      },
    });
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

const convertSquareMetersToAcres = (squareMeters: number) => {
  return squareMeters * 0.000247105;
};
