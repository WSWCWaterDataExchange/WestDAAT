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
import Dropdown from 'react-bootstrap/esm/Dropdown';
import {
  conservationApplicationMaxPolygonAcreage,
  conservationApplicationMaxPolygonCount,
} from '../../../../config/constants';
import { formatNumber } from '../../../../utilities/valueFormatters';
import { OverlayTooltip } from '../../../../components/OverlayTooltip';

interface ReviewMapProps {
  waterRightNativeId: string | undefined;
  handleEstimateConsumptiveUseClicked: (updateEstimate: boolean) => void;
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
    addGeometriesToMap,
    exportToPngFn,
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

  const controlLocationLabelFeature: Feature<Point, GeoJsonProperties> | undefined = useMemo(() => {
    if (!controlLocationFeature) {
      return undefined;
    }

    return {
      type: 'Feature',
      geometry: controlLocationFeature.geometry,
      properties: {
        title: 'Control Point',
      },
    };
  }, [controlLocationFeature, controlLocationFeature?.geometry]);

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

    // zoom map in to focus on polygons + control location
    const allFeaturesCollection: FeatureCollection<Geometry, GeoJsonProperties> = {
      type: 'FeatureCollection',
      features: allFeatures,
    };
    setMapBoundSettings({
      LngLatBounds: getLatsLongsFromFeatureCollection(allFeaturesCollection),
      padding: 200,
      maxZoom: 16,
      duration: 2000,
    });

    if (exportToPngFn) {
      exportToPngFn!({
        height: 600,
        width: 800,
      });
    }

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

  useEffect(() => {
    const data = state.conservationApplication.polygonsAddedByFileUpload;
    if (!isMapLoaded || data.length === 0) {
      return;
    }

    // put new polygons onto map
    const newFeatures = data.map(fromPartialPolygonDataToPolygonFeature);
    addGeometriesToMap.current!(newFeatures);

    // zoom to fit all data
    const allFeatures = [
      ...userDrawnPolygonFeatures,
      ...newFeatures,
      ...(controlLocationFeature ? [controlLocationFeature] : []),
    ];
    const allFeaturesFeatureCollection: FeatureCollection<Geometry, GeoJsonProperties> = {
      type: 'FeatureCollection',
      features: allFeatures,
    };
    setMapBoundSettings({
      LngLatBounds: getLatsLongsFromFeatureCollection(allFeaturesFeatureCollection),
      padding: 200,
      maxZoom: 16,
      duration: 5000,
    });

    dispatch({
      type: 'GIS_FILE_POLYGONS_PROCESSED',
    });
  }, [isMapLoaded, state.conservationApplication.polygonsAddedByFileUpload]);

  const handleMapDrawnPolygonChange = (mapGeometries: Feature<Geometry, GeoJsonProperties>[]) => {
    // irrigated field locations
    const polygonFeatures: Feature<Polygon, GeoJsonProperties>[] = mapGeometries
      .filter((feature) => feature.geometry.type === 'Polygon')
      .map((feature) => feature as Feature<Polygon, GeoJsonProperties>);

    // validate irrigated field locations
    if (polygonFeatures.length > conservationApplicationMaxPolygonCount) {
      toast.error(
        `You may only select up to ${conservationApplicationMaxPolygonCount} fields at a time. Please redraw the polygons so there are ${conservationApplicationMaxPolygonCount} or fewer.`,
      );
    }

    const doPolygonsOverlap = doPolygonsIntersect(polygonFeatures);
    if (doPolygonsOverlap) {
      toast.error('Polygons may not intersect. Please redraw the polygons so they do not overlap.');
    }

    const polygonData: MapSelectionPolygonData[] = polygonFeatures.map(fromGeometryFeatureToMapSelectionPolygonData);
    if (polygonData.some((p) => p.acreage > conservationApplicationMaxPolygonAcreage)) {
      toast.error(`Polygons may not exceed ${formatNumber(conservationApplicationMaxPolygonAcreage, 0)} acres.`);
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

  const estimateButtonEnabled = state.canReviewerEstimateConsumptiveUse && !props.isLoadingConsumptiveUseEstimate;

  return (
    <div className="flex-grow-1 position-relative">
      <div className="w-100 position-absolute d-flex justify-content-around p-1 d-print-none">
        <div className="estimate-tool-map-dimmed-overlay"></div>
        <Dropdown style={{ zIndex: 1000 }}>
          <div className="d-flex align-items-center gap-2">
            <Dropdown.Toggle variant="success" disabled={!estimateButtonEnabled}>
              {props.isLoadingConsumptiveUseEstimate && <Spinner animation="border" size="sm" className="me-2" />}
              Estimate Consumptive Use
            </Dropdown.Toggle>

            <OverlayTooltip text="You must provide a control point to estimate consumptive use." placement="bottom" />
          </div>

          <Dropdown.Menu>
            <Dropdown.Item
              onClick={() => props.handleEstimateConsumptiveUseClicked(false)}
              disabled={!estimateButtonEnabled}
            >
              Only Retrieve Estimate
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => props.handleEstimateConsumptiveUseClicked(true)}
              disabled={!estimateButtonEnabled}
            >
              Retrieve Estimate and Save Changes
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <Map
        handleMapDrawnPolygonChange={handleMapDrawnPolygonChange}
        conservationApplicationPolygonLabelFeatures={userDrawnPolygonLabelFeatures}
        conservationApplicationPointLabelFeature={controlLocationLabelFeature}
        isConsumptiveUseAlertEnabled={false}
        isGeocoderInputFeatureEnabled={false}
        isControlLocationSelectionToolDisplayed={true}
      />
      <EstimationToolTableView perspective="reviewer" />
    </div>
  );
}

export default ReviewMap;
