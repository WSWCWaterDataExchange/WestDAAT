import { Feature, GeoJsonProperties, Geometry, Polygon } from 'geojson';
import Map from '../../../components/map/Map';
import { EstimationFormMapPolygon } from '../../../data-contracts/EstimationFormMapPolygon';
import { convertGeometryToWkt } from '../../../utilities/geometryWktConverter';
import { area as areaInSquareMeters } from '@turf/area';
import { useConservationApplicationContext } from '../../../contexts/ConservationApplicationProvider';
import Button from 'react-bootstrap/esm/Button';
import Spinner from 'react-bootstrap/esm/Spinner';
import { convertSquareMetersToAcres } from '../../../utilities/valueConverters';
import intersect from '@turf/intersect';
import { featureCollection } from '@turf/helpers';
import { toast } from 'react-toastify';

interface EstimationToolMapProps {
  handleEstimateConsumptiveUseClicked: () => void;
  isLoadingConsumptiveUseEstimate: boolean;
}

export function EstimationToolMap(props: EstimationToolMapProps) {
  const { state, dispatch } = useConservationApplicationContext();

  const handleMapDrawnPolygonChange = (polygons: Feature<Geometry, GeoJsonProperties>[]) => {
    const doPolygonsOverlap = doPolygonsIntersect(polygons);
    if (doPolygonsOverlap) {
      toast.error('Polygons may not intersect. Please redraw the polygons so they do not overlap.');
    }

    const polygonData: EstimationFormMapPolygon[] = polygons.map((polygonFeature) => ({
      polygonWkt: convertGeometryToWkt(polygonFeature.geometry),
      acreage: convertSquareMetersToAcres(areaInSquareMeters(polygonFeature)),
    }));

    dispatch({
      type: 'MAP_POLYGONS_UPDATED',
      payload: {
        polygons: polygonData,
        doPolygonsOverlap,
      },
    });
  };

  const estimateButtonEnabled = state.canEstimateConsumptiveUse && !props.isLoadingConsumptiveUseEstimate;

  return (
    <div className="flex-grow-1 position-relative">
      <div className="w-100 position-absolute d-flex justify-content-center p-1">
        <div className="estimate-tool-map-dimmed-overlay"></div>
        <Button
          variant="success"
          style={{ zIndex: 1000 }}
          onClick={props.handleEstimateConsumptiveUseClicked}
          disabled={!estimateButtonEnabled}
        >
          {props.isLoadingConsumptiveUseEstimate ? (
            <Spinner animation="border" size="sm" />
          ) : (
            'Estimate Consumptive Use for the Drawn Polygon(s)'
          )}
        </Button>
      </div>
      <Map
        handleMapDrawnPolygonChange={handleMapDrawnPolygonChange}
        isConsumptiveUseAlertEnabled={false}
        isGeocoderInputFeatureEnabled={false}
      />
    </div>
  );
}

const doPolygonsIntersect = (polygons: Feature<Geometry, GeoJsonProperties>[]): boolean => {
  for (let i = 0; i < polygons.length; i++) {
    for (let j = i + 1; j < polygons.length; j++) {
      const p1 = polygons[i] as Feature<Polygon, GeoJsonProperties>;
      const p2 = polygons[j] as Feature<Polygon, GeoJsonProperties>;

      const intersection = intersect(featureCollection([p1, p2]));

      if (intersection) {
        return true;
      }
    }
  }

  return false;
};
