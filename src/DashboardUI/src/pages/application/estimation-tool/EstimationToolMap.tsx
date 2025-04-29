import { Feature, FeatureCollection, GeoJsonProperties, Geometry, Point, Polygon } from 'geojson';
import Map from '../../../components/map/Map';
import { convertWktToGeometry } from '../../../utilities/geometryWktConverter';
import { useConservationApplicationContext } from '../../../contexts/ConservationApplicationProvider';
import Button from 'react-bootstrap/esm/Button';
import Spinner from 'react-bootstrap/esm/Spinner';
import { toast } from 'react-toastify';
import { doPolygonsIntersect, getLatsLongsFromFeatureCollection } from '../../../utilities/geometryHelpers';
import EstimationToolTableView from './EstimationToolTableView';
import centerOfMass from '@turf/center-of-mass';
import { useEffect, useMemo } from 'react';
import { MapStyle, useMapContext } from '../../../contexts/MapProvider';
import { useWaterRightSiteLocations } from '../../../hooks/queries';
import { mapLayerNames, mapSourceNames } from '../../../config/maps';
import { MapSelectionPolygonData } from '../../../data-contracts/CombinedPolygonData';
import {
  fromPartialPolygonDataToPolygonFeature,
  fromGeometryFeatureToMapSelectionPolygonData,
} from '../../../utilities/mapUtility';
import {
  conservationApplicationMaxPolygonAcreage,
  conservationApplicationMaxPolygonCount,
} from '../../../config/constants';
import { formatNumber } from '../../../utilities/valueFormatters';

interface EstimationToolMapProps {
  waterRightNativeId: string | undefined;
  handleEstimateConsumptiveUseClicked: () => void;
  isLoadingConsumptiveUseEstimate: boolean;
}

export function EstimationToolMap(props: EstimationToolMapProps) {
  const { state, dispatch } = useConservationApplicationContext();
  const {
    isMapLoaded,
    setMapBoundSettings,
    setMapStyle,
    setVisibleLayers,
    setGeoJsonData,
    setUserDrawnPolygonData,
    addGeometriesToMap,
  } = useMapContext();

  useEffect(() => {
    if (!isMapLoaded) {
      return;
    }
    setMapStyle(MapStyle.Satellite);
  }, [isMapLoaded, setMapStyle]);

  const siteLocationsQuery = useWaterRightSiteLocations(props.waterRightNativeId);

  useEffect(() => {
    if (!isMapLoaded || siteLocationsQuery.isLoading) {
      return;
    }

    // render the site location point on the map
    setVisibleLayers([mapLayerNames.siteLocationsPointsLayer]);
    setGeoJsonData(mapSourceNames.detailsMapGeoJson, siteLocationsQuery.data!);

    // zoom to the site location point
    setMapBoundSettings({
      LngLatBounds: getLatsLongsFromFeatureCollection(siteLocationsQuery.data!),
      padding: 25,
      maxZoom: 16,
      duration: 2000,
    });
  }, [isMapLoaded, siteLocationsQuery.data, siteLocationsQuery.isLoading]);

  useEffect(() => {
    const polygonData = state.conservationApplication.estimateLocations;
    const hasPerformedEstimation = polygonData.some((p) => !!p.waterConservationApplicationEstimateLocationId);
    if (!hasPerformedEstimation) {
      return;
    }

    const userDrawnPolygonFeatures: Feature<Polygon, GeoJsonProperties>[] = polygonData.map(
      fromPartialPolygonDataToPolygonFeature,
    );
    const userDrawnPolygonFeatureCollection: FeatureCollection<Polygon, GeoJsonProperties> = {
      type: 'FeatureCollection',
      features: userDrawnPolygonFeatures,
    };

    setMapBoundSettings({
      LngLatBounds: getLatsLongsFromFeatureCollection(userDrawnPolygonFeatureCollection),
      padding: 50,
      maxZoom: 16,
    });
  }, [
    state.conservationApplication.estimateLocations,
    convertWktToGeometry,
    getLatsLongsFromFeatureCollection,
    setMapBoundSettings,
  ]);

  const polygonLabelFeatures: Feature<Point, GeoJsonProperties>[] = useMemo(() => {
    const polygonData = state.conservationApplication.estimateLocations;
    const hasPerformedEstimation = polygonData.some((p) => !!p.waterConservationApplicationEstimateLocationId);
    if (!hasPerformedEstimation) {
      return [];
    }

    const labelFeatures: Feature<Point, GeoJsonProperties>[] = polygonData.map((polygon) => {
      const polygonFeature = convertWktToGeometry(polygon.polygonWkt!);
      const labelLocation = centerOfMass(polygonFeature);
      labelLocation.properties = {
        ...labelLocation.properties,
        title: polygon.fieldName,
      };
      return labelLocation;
    });
    return labelFeatures;
  }, [state.conservationApplication.estimateLocations]);

  useEffect(() => {
    const data = state.conservationApplication.polygonsAddedByFileUpload;
    if (!isMapLoaded || data.length === 0) {
      return;
    }

    // put new polygons onto map
    const newFeatures = data.map(fromPartialPolygonDataToPolygonFeature);
    addGeometriesToMap.current!(newFeatures);

    const existingFeatures: Feature<Polygon, GeoJsonProperties>[] = state.conservationApplication.estimateLocations.map(
      fromPartialPolygonDataToPolygonFeature,
    );

    // zoom to fit all data
    const allFeatures = [...existingFeatures, ...newFeatures];
    const allFeaturesFeatureCollection: FeatureCollection<Geometry, GeoJsonProperties> = {
      type: 'FeatureCollection',
      features: allFeatures,
    };
    setMapBoundSettings({
      LngLatBounds: getLatsLongsFromFeatureCollection(allFeaturesFeatureCollection),
      padding: 50,
      maxZoom: 16,
      duration: 5000,
    });

    dispatch({
      type: 'GIS_FILE_POLYGONS_PROCESSED',
    });
  }, [isMapLoaded, state.conservationApplication.polygonsAddedByFileUpload]);

  const handleMapDrawnPolygonChange = (polygons: Feature<Geometry, GeoJsonProperties>[]) => {
    if (polygons.length > conservationApplicationMaxPolygonCount) {
      toast.error(
        `You may only select up to ${conservationApplicationMaxPolygonCount} fields at a time. Please redraw the polygons so there are ${conservationApplicationMaxPolygonCount} or fewer.`,
      );
    }

    const doPolygonsOverlap = doPolygonsIntersect(polygons);
    if (doPolygonsOverlap) {
      toast.error('Polygons may not intersect. Please redraw the polygons so they do not overlap.');
    }

    const polygonData: MapSelectionPolygonData[] = polygons.map(fromGeometryFeatureToMapSelectionPolygonData);

    if (polygonData.some((p) => p.acreage > conservationApplicationMaxPolygonAcreage)) {
      toast.error(`Polygons may not exceed ${formatNumber(conservationApplicationMaxPolygonAcreage, 0)} acres.`);
    }

    dispatch({
      type: 'MAP_POLYGONS_UPDATED',
      payload: {
        polygons: polygonData,
        doPolygonsOverlap,
      },
    });

    setUserDrawnPolygonData(polygons);
  };

  const estimateButtonEnabled = state.canApplicantEstimateConsumptiveUse && !props.isLoadingConsumptiveUseEstimate;

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
        conservationApplicationPolygonLabelFeatures={polygonLabelFeatures}
        isConsumptiveUseAlertEnabled={false}
        isGeocoderInputFeatureEnabled={false}
      />
      <EstimationToolTableView perspective="applicant" />
    </div>
  );
}
