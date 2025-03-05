import { Feature, FeatureCollection, GeoJsonProperties, Geometry, Point, Polygon } from 'geojson';
import Map from '../../../components/map/Map';
import { EstimationFormMapPolygon } from '../../../data-contracts/EstimationFormMapPolygon';
import { convertGeometryToWkt, convertWktToGeometry } from '../../../utilities/geometryWktConverter';
import { area as areaInSquareMeters } from '@turf/area';
import { useConservationApplicationContext } from '../../../contexts/ConservationApplicationProvider';
import Button from 'react-bootstrap/esm/Button';
import Spinner from 'react-bootstrap/esm/Spinner';
import { convertSquareMetersToAcres } from '../../../utilities/valueConverters';
import { toast } from 'react-toastify';
import { doPolygonsIntersect, getLatsLongsFromFeatureCollection } from '../../../utilities/geometryHelpers';
import EstimationToolTableView from './EstimationToolTableView';
import centerOfMass from '@turf/center-of-mass';
import { useEffect, useMemo } from 'react';
import { MapStyle, useMapContext } from '../../../contexts/MapProvider';
import { useWaterRightSiteLocations } from '../../../hooks/queries';
import { mapLayerNames, mapSourceNames } from '../../../config/maps';

interface EstimationToolMapProps {
  waterRightNativeId: string | undefined;
  handleEstimateConsumptiveUseClicked: () => void;
  isLoadingConsumptiveUseEstimate: boolean;
}

export function EstimationToolMap(props: EstimationToolMapProps) {
  const { state, dispatch } = useConservationApplicationContext();
  const { isMapLoaded, setMapBoundSettings, setMapStyle, setVisibleLayers, setGeoJsonData, setUserDrawnPolygonData } =
    useMapContext();

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
    });
  }, [isMapLoaded, siteLocationsQuery.data, siteLocationsQuery.isLoading]);

  useEffect(() => {
    const hasPerformedEstimation = state.conservationApplication.polygonEtData.length > 0;
    if (!hasPerformedEstimation) {
      return;
    }

    const userDrawnPolygonGeometries = state.conservationApplication.polygonEtData.map(
      (dataCollection) => convertWktToGeometry(dataCollection.polygonWkt) as Polygon,
    );
    const userDrawnPolygonFeatureCollection: FeatureCollection<Polygon, GeoJsonProperties> = {
      type: 'FeatureCollection',
      features: userDrawnPolygonGeometries.map(
        (geometry): Feature<Polygon, GeoJsonProperties> => ({
          type: 'Feature',
          geometry,
          properties: {},
        }),
      ),
    };

    setMapBoundSettings({
      LngLatBounds: getLatsLongsFromFeatureCollection(userDrawnPolygonFeatureCollection),
      padding: 25,
      maxZoom: 16,
    });
  }, [
    state.conservationApplication.polygonEtData,
    convertWktToGeometry,
    getLatsLongsFromFeatureCollection,
    setMapBoundSettings,
  ]);

  const polygonLabelFeatures: Feature<Point, GeoJsonProperties>[] = useMemo(() => {
    const hasPerformedEstimation = state.conservationApplication.polygonEtData.length > 0;
    if (!hasPerformedEstimation) {
      return [];
    }

    const labelFeatures: Feature<Point, GeoJsonProperties>[] = state.conservationApplication.polygonEtData.map(
      (dataCollection) => {
        const polygonFeature = convertWktToGeometry(dataCollection.polygonWkt);
        const labelLocation = centerOfMass(polygonFeature);
        labelLocation.properties = {
          ...labelLocation.properties,
          title: dataCollection.fieldName,
        };
        return labelLocation;
      },
    );
    return labelFeatures;
  }, [state.conservationApplication.polygonEtData]);

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

    setUserDrawnPolygonData(polygons);
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
          {props.isLoadingConsumptiveUseEstimate && <Spinner animation="border" size="sm" className="me-2" />}
          Estimate Consumptive Use for the Drawn Polygon(s)
        </Button>
      </div>
      <Map
        handleMapDrawnPolygonChange={handleMapDrawnPolygonChange}
        polygonLabelFeatures={polygonLabelFeatures}
        isConsumptiveUseAlertEnabled={false}
        isGeocoderInputFeatureEnabled={false}
      />
      <EstimationToolTableView />
    </div>
  );
}
