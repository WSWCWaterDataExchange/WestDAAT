import { Feature, GeoJsonProperties, Geometry } from 'geojson';
import Map from '../../../components/map/Map';
import { EstimationFormMapPolygon } from '../../../data-contracts/EstimationFormMapPolygon';
import { convertGeometryToWkt } from '../../../utilities/geometryWktConverter';
import { area as areaInSquareMeters } from '@turf/area';
import { useConservationApplicationContext } from '../../../contexts/ConservationApplicationProvider';
import { Button } from 'react-bootstrap';

interface EstimationToolMapProps {
  handleEstimateConsumptiveUseClicked: () => void;
}

export function EstimationToolMap(props: EstimationToolMapProps) {
  const { state, dispatch } = useConservationApplicationContext();

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

  // it feels weird to have this logic here. what's a better place for it? it's duplicated in the useEstimateConsumptiveUse hook
  const estimateButtonEnabled =
    !!state.conservationApplication.waterConservationApplicationId &&
    !!state.conservationApplication.waterRightNativeId &&
    !!state.conservationApplication.openEtModelName &&
    !!state.conservationApplication.dateRangeStart &&
    !!state.conservationApplication.dateRangeEnd &&
    !!state.conservationApplication.selectedMapPolygons &&
    state.conservationApplication.selectedMapPolygons.length > 0;

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
          Estimate Consumptive Use for the Drawn Polygon(s)
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

const convertSquareMetersToAcres = (squareMeters: number) => {
  return squareMeters * 0.000247105;
};
