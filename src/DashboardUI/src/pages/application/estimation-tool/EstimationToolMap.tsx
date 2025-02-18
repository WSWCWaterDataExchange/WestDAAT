import { Feature, GeoJsonProperties, Geometry } from 'geojson';
import Map from '../../../components/map/Map';
import { EstimationFormMapPolygon } from '../../../data-contracts/EstimationFormMapPolygon';
import { convertGeometryToWkt } from '../../../utilities/geometryWktConverter';
import { area as areaInSquareMeters } from '@turf/area';
import { useConservationApplicationContext } from '../../../contexts/ConservationApplicationProvider';
import Button from 'react-bootstrap/esm/Button';
import Spinner from 'react-bootstrap/esm/Spinner';
import { convertSquareMetersToAcres } from '../../../utilities/valueConverters';

interface EstimationToolMapProps {
  handleEstimateConsumptiveUseClicked: () => void;
  isLoadingConsumptiveUseEstimate: boolean;
}

export function EstimationToolMap(props: EstimationToolMapProps) {
  const { state, dispatch } = useConservationApplicationContext();

  const handleMapDrawnPolygonChange = (polygons: Feature<Geometry, GeoJsonProperties>[]) => {
    const polygonData: EstimationFormMapPolygon[] = polygons.map((polygonFeature) => ({
      polygonWkt: convertGeometryToWkt(polygonFeature.geometry),
      acreage: convertSquareMetersToAcres(areaInSquareMeters(polygonFeature)),
    }));

    dispatch({
      type: 'MAP_POLYGONS_UPDATED',
      payload: {
        polygons: polygonData,
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
