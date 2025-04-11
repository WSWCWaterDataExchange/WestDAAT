import { Feature, FeatureCollection, GeoJsonProperties, Geometry, Point, Polygon } from 'geojson';
import Map from '../../../../components/map/Map';
import EstimationToolTableView from '../../estimation-tool/EstimationToolTableView';
import { toast } from 'react-toastify';
import { doPolygonsIntersect, getLatsLongsFromFeatureCollection } from '../../../../utilities/geometryHelpers';
import { MapSelectionPolygonData } from '../../../../data-contracts/CombinedPolygonData';
import { convertGeometryToWkt, convertWktToGeometry } from '../../../../utilities/geometryWktConverter';
import { convertSquareMetersToAcres } from '../../../../utilities/valueConverters';
import { useConservationApplicationContext } from '../../../../contexts/ConservationApplicationProvider';
import { MapStyle, useMapContext } from '../../../../contexts/MapProvider';
import Button from 'react-bootstrap/esm/Button';
import { useEffect, useMemo, useState } from 'react';
import centerOfMass from '@turf/center-of-mass';
import Spinner from 'react-bootstrap/esm/Spinner';
import { area as areaInSquareMeters } from '@turf/area';
import {
  fromGeometryFeatureToMapSelectionPolygonData,
  fromPartialPointDataToPointFeature,
  fromPartialPolygonDataToPolygonFeature,
} from '../../../../utilities/mapUtility';

interface ReviewMapProps {
  waterRightNativeId: string | undefined;
  handleEstimateConsumptiveUseClicked: () => void;
  isLoadingConsumptiveUseEstimate: boolean;
}

function ReviewMap(props: ReviewMapProps) {
  const { state, dispatch } = useConservationApplicationContext();
  const { isMapLoaded, setMapBoundSettings, setMapStyle, setUserDrawnPolygonData } = useMapContext();

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
    if (!state.conservationApplication.controlLocation) {
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

    const polygonData: MapSelectionPolygonData[] = polygons.map(fromGeometryFeatureToMapSelectionPolygonData);

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
