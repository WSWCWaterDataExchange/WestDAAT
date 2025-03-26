import { Feature, FeatureCollection, GeoJsonProperties, Geometry, Point, Polygon } from 'geojson';
import Map from '../../../../components/map/Map';
import EstimationToolTableView from '../../estimation-tool/EstimationToolTableView';
import { toast } from 'react-toastify';
import { doPolygonsIntersect, getLatsLongsFromFeatureCollection } from '../../../../utilities/geometryHelpers';
import { MapSelectionPolygonData } from '../../../../data-contracts/CombinedPolygonData';
import { convertGeometryToWkt, convertWktToGeometry } from '../../../../utilities/geometryWktConverter';
import { convertSquareMetersToAcres } from '../../../../utilities/valueConverters';
import { useConservationApplicationContext } from '../../../../contexts/ConservationApplicationProvider';
import { useMapContext } from '../../../../contexts/MapProvider';
import Button from 'react-bootstrap/esm/Button';
import { useEffect, useMemo } from 'react';
import centerOfMass from '@turf/center-of-mass';
import Spinner from 'react-bootstrap/esm/Spinner';
import { area as areaInSquareMeters } from '@turf/area';

interface ReviewMapProps {
  waterRightNativeId: string | undefined;
  handleEstimateConsumptiveUseClicked: () => void;
  isLoadingConsumptiveUseEstimate: boolean;
}

function ReviewMap(props: ReviewMapProps) {
  const { state, dispatch } = useConservationApplicationContext();
  const { isMapLoaded, setMapBoundSettings, setMapStyle, setVisibleLayers, setGeoJsonData, setUserDrawnPolygonData } =
    useMapContext();

  const isReadyToInitializeGeometries = useMemo(() => {
    const polygonData = state.conservationApplication.estimateLocations;
    const hasPerformedEstimation = polygonData.some((p) => !!p.waterConservationApplicationEstimateLocationId);
    return hasPerformedEstimation;
  }, [state.conservationApplication.estimateLocations]);

  const userDrawnPolygonGeometries: Polygon[] = useMemo(() => {
    if (!isReadyToInitializeGeometries) {
      return [];
    }

    return state.conservationApplication.estimateLocations.map(
      (polygon) => convertWktToGeometry(polygon.polygonWkt!) as Polygon,
    );
  }, [isReadyToInitializeGeometries, state.conservationApplication.estimateLocations]);

  const userDrawnPolygonFeatures: Feature<Polygon, GeoJsonProperties>[] = useMemo(() => {
    return userDrawnPolygonGeometries.map(
      (geometry): Feature<Polygon, GeoJsonProperties> => ({
        type: 'Feature',
        geometry,
        properties: {},
      }),
    );
  }, [userDrawnPolygonGeometries]);

  const userDrawnPolygonLabelFeatures: Feature<Point, GeoJsonProperties>[] = useMemo(() => {
    return state.conservationApplication.estimateLocations.map((polygon) => {
      const polygonFeature = convertWktToGeometry(polygon.polygonWkt!) as Polygon;
      const labelLocation = centerOfMass(polygonFeature);
      labelLocation.properties = {
        ...labelLocation.properties,
        title: polygon.fieldName,
      };
      return labelLocation;
    });
  }, [state.conservationApplication.estimateLocations, convertWktToGeometry, centerOfMass]);

  useEffect(() => {
    if (!userDrawnPolygonFeatures) {
      return;
    }

    // display user-drawn polygons on map
    // side note: labels are handled separately
    setUserDrawnPolygonData(userDrawnPolygonFeatures);

    // zoom map in to focus on polygons
    const userDrawnPolygonFeatureCollection: FeatureCollection<Geometry, GeoJsonProperties> = {
      type: 'FeatureCollection',
      features: userDrawnPolygonFeatures,
    };
    setMapBoundSettings({
      LngLatBounds: getLatsLongsFromFeatureCollection(userDrawnPolygonFeatureCollection),
      padding: 25,
      maxZoom: 16,
    });
  }, [
    state.conservationApplication.estimateLocations,
    convertWktToGeometry,
    getLatsLongsFromFeatureCollection,
    setMapBoundSettings,
  ]);

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

    const polygonData: MapSelectionPolygonData[] = polygons.map((polygonFeature) => ({
      polygonWkt: convertGeometryToWkt(polygonFeature.geometry),
      acreage: convertSquareMetersToAcres(areaInSquareMeters(polygonFeature)),
    }));

    if (polygonData.some((p) => p.acreage > 50000)) {
      toast.error('Polygons may not exceed 50,000 acres.');
    }

    dispatch({
      type: 'MAP_POLYGONS_UPDATED',
      payload: {
        polygons: polygonData,
        doPolygonsOverlap,
      },
    });

    // todo: add user drawn polygon
  };

  const estimateButtonEnabled = state.canEstimateConsumptiveUse && !props.isLoadingConsumptiveUseEstimate;

  return (
    <div className="flex-grow-1 position-relative">
      <div className="w-100 position-absolute d-flex justify-content-center p-1 d-print-none">
        <div className="estimate-tool-map-dimmed-overlay"></div>
        <Button
          variant="success"
          style={{ zIndex: 1000 }}
          onClick={props.handleEstimateConsumptiveUseClicked}
          disabled={!estimateButtonEnabled}
        >
          {props.isLoadingConsumptiveUseEstimate && <Spinner animation="border" size="sm" className="me-2" />}
          Estimate Consumptive Use for the Drawn Polygon(s)
        </Button>
      </div>
      <Map
        handleMapDrawnPolygonChange={handleMapDrawnPolygonChange}
        polygonLabelFeatures={userDrawnPolygonLabelFeatures}
        isConsumptiveUseAlertEnabled={false}
        isGeocoderInputFeatureEnabled={false}
      />
      <EstimationToolTableView />
    </div>
  );
}

export default ReviewMap;
