import { Feature, FeatureCollection, GeoJsonProperties, Geometry, Point, Polygon } from 'geojson';
import Map from '../../../../components/map/Map';
import EstimationToolTableView from '../../estimation-tool/EstimationToolTableView';
import { toast } from 'react-toastify';
import {
  doesPointExistWithinPolygon,
  doPolygonsIntersect,
  getLatsLongsFromFeatureCollection,
} from '../../../../utilities/geometryHelpers';
import { MapSelectionPolygonData } from '../../../../data-contracts/CombinedPolygonData';
import { convertWktToGeometry } from '../../../../utilities/geometryWktConverter';
import { useConservationApplicationContext } from '../../../../contexts/ConservationApplicationProvider';
import { MapStyle, useMapContext } from '../../../../contexts/MapProvider';
import Button from 'react-bootstrap/esm/Button';
import { useEffect, useMemo, useState } from 'react';
import centerOfMass from '@turf/center-of-mass';
import Spinner from 'react-bootstrap/esm/Spinner';
import {
  fromGeometryFeatureToMapSelectionPointData,
  fromGeometryFeatureToMapSelectionPolygonData,
  fromPartialPointDataToPointFeature,
  fromPartialPolygonDataToPolygonFeature,
} from '../../../../utilities/mapUtility';
import { MapSelectionPointData } from '../../../../data-contracts/CombinedPointData';

interface ReviewMapProps {
  waterRightNativeId: string | undefined;
  handleEstimateConsumptiveUseClicked: () => void;
  isLoadingConsumptiveUseEstimate: boolean;
}

function ReviewMap(props: ReviewMapProps) {
  const { state, dispatch } = useConservationApplicationContext();
  const {
    isMapLoaded,
    setMapBoundSettings,
    setMapStyle,
    setUserDrawnPolygonData,
    setIsControlLocationSelectionToolEnabled,
  } = useMapContext();

  const [hasInitializedMap, setHasInitializedMap] = useState(false);

  useEffect(() => {
    if (!isMapLoaded) {
      return;
    }
    setMapStyle(MapStyle.Satellite);
  }, [isMapLoaded, setMapStyle]);

  const userDrawnPolygonFeatures: Feature<Polygon, GeoJsonProperties>[] = useMemo(() => {
    return state.conservationApplication.estimateLocations.map(fromPartialPolygonDataToPolygonFeature);
  }, [state.conservationApplication.estimateLocations]);

  const controlLocationFeature: Feature<Point, GeoJsonProperties> | undefined = useMemo(() => {
    if (!state.conservationApplication.controlLocation?.pointWkt) {
      return undefined;
    }
    return fromPartialPointDataToPointFeature(state.conservationApplication.controlLocation);
  }, [state.conservationApplication.controlLocation]);

  const userDrawnPolygonLabelFeatures: Feature<Point, GeoJsonProperties>[] = useMemo(() => {
    return userDrawnPolygonFeatures
      .filter((polygonFeature) => !!polygonFeature.properties?.title)
      .map((polygonFeature) => {
        const labelLocation = centerOfMass(polygonFeature);
        labelLocation.properties = {
          ...labelLocation.properties,
          title: polygonFeature.properties!.title,
        };
        return labelLocation;
      });
  }, [userDrawnPolygonFeatures]);

  useEffect(() => {
    if (!userDrawnPolygonFeatures || !isMapLoaded || hasInitializedMap) {
      return;
    }

    // display user-drawn polygons + control location point on map
    // side note: labels are handled separately
    const controlLocationFeatures = controlLocationFeature ? [controlLocationFeature] : [];
    const allFeatures: Feature<Geometry, GeoJsonProperties>[] = [
      ...userDrawnPolygonFeatures,
      ...controlLocationFeatures,
    ];
    setUserDrawnPolygonData(allFeatures);

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

    setHasInitializedMap(true);
  }, [
    userDrawnPolygonFeatures,
    controlLocationFeature,
    isMapLoaded,
    convertWktToGeometry,
    getLatsLongsFromFeatureCollection,
    setMapBoundSettings,
  ]);

  useEffect(() => {
    // to avoid possible issues where a user tries to add multiple control locations,
    // the control location selection tool is only enabled if there is no control location on the map
    if (!controlLocationFeature) {
      setIsControlLocationSelectionToolEnabled(true);
    } else {
      setIsControlLocationSelectionToolEnabled(false);
    }
  }, [controlLocationFeature, setIsControlLocationSelectionToolEnabled]);

  const handleMapDrawnPolygonChange = (mapGeometries: Feature<Geometry, GeoJsonProperties>[]) => {
    // irrigated field locations
    const polygonFeatures: Feature<Polygon, GeoJsonProperties>[] = mapGeometries
      .filter((feature) => feature.geometry.type === 'Polygon')
      .map((feature) => feature as Feature<Polygon, GeoJsonProperties>);

    // validate irrigated field locations
    if (polygonFeatures.length > 20) {
      toast.error(
        'You may only select up to 20 fields at a time. Please redraw the polygons so there are 20 or fewer.',
      );
    }

    const doPolygonsOverlap = doPolygonsIntersect(polygonFeatures);
    if (doPolygonsOverlap) {
      toast.error('Polygons may not intersect. Please redraw the polygons so they do not overlap.');
    }

    const polygonData: MapSelectionPolygonData[] = polygonFeatures.map(fromGeometryFeatureToMapSelectionPolygonData);
    if (polygonData.some((p) => p.acreage > 50000)) {
      toast.error('Polygons may not exceed 50,000 acres.');
    }

    // control location (non-irrigated field location)
    const pointFeatures: Feature<Point, GeoJsonProperties>[] = mapGeometries
      .filter((feature) => feature.geometry.type === 'Point')
      .map((feature) => feature as Feature<Point, GeoJsonProperties>);

    // validate control location
    if (pointFeatures.length > 1) {
      toast.error('You may only select one control location.');
    }
    const [controlLocationFeature] = pointFeatures;

    let doesControlLocationOverlapWithPolygons: boolean | undefined;
    let controlLocationData: MapSelectionPointData | undefined;
    if (controlLocationFeature) {
      doesControlLocationOverlapWithPolygons = polygonFeatures.some((polygonFeature) =>
        doesPointExistWithinPolygon(controlLocationFeature, polygonFeature),
      );

      controlLocationData = fromGeometryFeatureToMapSelectionPointData(controlLocationFeature);
    }

    if (doesControlLocationOverlapWithPolygons) {
      toast.error(
        'The control location may not be within any of the irrigated field locations. Please replace the control location.',
      );
    }

    dispatch({
      type: 'REVIEWER_MAP_DATA_UPDATED',
      payload: {
        polygons: polygonData,
        doPolygonsOverlap,
        controlLocation: controlLocationData,
        doesControlLocationOverlapWithPolygons,
      },
    });
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
        isControlLocationSelectionToolDisplayed={true}
      />
      <EstimationToolTableView perspective="reviewer" />
    </div>
  );
}

export default ReviewMap;
