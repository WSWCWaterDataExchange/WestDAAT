import { Feature, GeoJsonProperties, Geometry, Point, Polygon } from 'geojson';
import Map from '../../../components/map/Map';
import { EstimationFormMapPolygon } from '../../../data-contracts/EstimationFormMapPolygon';
import { convertGeometryToWkt } from '../../../utilities/geometryWktConverter';
import { area as areaInSquareMeters } from '@turf/area';
import { useConservationApplicationContext } from '../../../contexts/ConservationApplicationProvider';
import Button from 'react-bootstrap/esm/Button';
import Spinner from 'react-bootstrap/esm/Spinner';
import { convertSquareMetersToAcres } from '../../../utilities/valueConverters';
import { toast } from 'react-toastify';
import { doPolygonsIntersect } from '../../../utilities/geometryHelpers';
import EstimationToolTableView from './EstimationToolTableView';
import centroid from '@turf/centroid';

interface EstimationToolMapProps {
  handleEstimateConsumptiveUseClicked: () => void;
  isLoadingConsumptiveUseEstimate: boolean;
}

//ETHAN
// I think you're going about this wrong. check tomorrow.
// the map is calling your generatePolygonLabelFeatures method *whenever the map is updated*, but that doesn't work.
// when the map is updated it's way too late to generate the labels, because then we have to reset all our ET data (if it exists).

// maybe what we can do instead is pass the generated label features as props to the map, and then the map can handle rendering them?

export function EstimationToolMap(props: EstimationToolMapProps) {
  const { state, dispatch } = useConservationApplicationContext();

  const generatePolygonLabelFeatures = (
    polygons: Feature<Geometry, GeoJsonProperties>[],
  ): Feature<Point, GeoJsonProperties>[] => {
    const hasPerformedEstimation = state.conservationApplication.polygonEtData.length > 0;
    if (!hasPerformedEstimation) {
      return [];
    }

    const labelFeatures: Feature<Point, GeoJsonProperties>[] = state.conservationApplication.polygonEtData.map(
      (dataCollection) => {
        // convert the polygonWkt into its geometry and compare with the features already displayed on the map
        // we need to find the matching feature so we can determine the correct label text
        const matchingMapPolygonFeature = polygons.find(
          (feature) =>
            feature.geometry.type === 'Polygon' && convertGeometryToWkt(feature.geometry) === dataCollection.polygonWkt,
        );

        if (!matchingMapPolygonFeature) {
          throw new Error('We have ET data for a polygon that does not exist on the map.');
        }

        const labelLocation = centroid(matchingMapPolygonFeature);
        return {
          type: 'Feature',
          geometry: labelLocation.geometry,
          properties: {
            title: dataCollection.fieldName,
          },
        };
      },
    );
    return labelFeatures;
  };

  const handleMapDrawnPolygonChange = (polygons: Feature<Geometry, GeoJsonProperties>[]) => {
    if (polygons.length > 20) {
      toast.error(
        'You may only select up to 20 fields at a time. Please redraw the polygons so there are 20 or fewer.',
      );
    }

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
        generatePolygonLabelFeatures={generatePolygonLabelFeatures}
        isConsumptiveUseAlertEnabled={false}
        isGeocoderInputFeatureEnabled={false}
      />
      {state.conservationApplication.polygonEtData.length > 0 && !props.isLoadingConsumptiveUseEstimate && (
        <EstimationToolTableView />
      )}
    </div>
  );
}
