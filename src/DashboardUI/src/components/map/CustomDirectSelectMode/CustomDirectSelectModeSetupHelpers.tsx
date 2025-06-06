import { center } from '@turf/center';
import { CustomDirectSelectModeState, DirectSelectDrawModeInstance } from './CustomDirectSelectMode';
import { GeoJsonProperties, Geometry, GeoJSON, Feature, Point, Position } from 'geojson';
import { distance } from '@turf/distance';
import { bearing } from '@turf/bearing';
import { destination } from '@turf/destination';
import { Marker } from 'mapbox-gl';
import { handleDragRectangleRotationMarker } from './CustomDirectSelectModeDragHelpers';
import { mdiRotateRight } from '@mdi/js';

export const handleSetupCircle = (state: CustomDirectSelectModeState) => {
  state.customState.circleState.circleCenterPointLngLat = center(state.feature!).geometry.coordinates as [
    number,
    number,
  ];
};

export const handleSetupRectangle = (_this: DirectSelectDrawModeInstance, state: CustomDirectSelectModeState) => {
  const rectangleCornerDrawFeatures = setupRectangleCorners(_this, state);
  const { rotationMarkers, rotationMarkerPositions } = setupRectangleRotationMarkers(_this, state);

  state.customState.rectangleState = {
    cornerFeatures: rectangleCornerDrawFeatures,
    rotationMarkers: rotationMarkers,
    rotationMarkersPreviousPositions: rotationMarkerPositions,
    totalRotationAngle: state.feature!.properties?.rotationAngle ?? 0,
  };
};

const setupRectangleCorners = (_this: DirectSelectDrawModeInstance, state: CustomDirectSelectModeState) => {
  // get rectangle's child corner Point features
  const rectangleCornerFeatures = getAllMapGeoJsonFeatures(_this.map).filter(
    (feature): feature is Feature<Point, GeoJsonProperties> => feature.properties?.parent === state.feature?.id,
  );

  // register the corner features in this draw mode and track them in state
  const rectangleCornerDrawFeatures = rectangleCornerFeatures.map((feature) => {
    const drawnFeature = _this.newFeature(feature) as MapboxDraw.DrawPoint;
    drawnFeature.setProperty('isCorner', true);
    return drawnFeature;
  });

  return rectangleCornerDrawFeatures;
};

const setupRectangleRotationMarkers = (_this: DirectSelectDrawModeInstance, state: CustomDirectSelectModeState) => {
  const rotationMarkerPositions = computeRectangleRotationMarkerPositions(state.feature!);

  const rotationMarkers = rotationMarkerPositions.map((position) => {
    return new Marker({
      element: createMarkerHtmlElement(),
    })
      .setLngLat({ lng: position[0], lat: position[1] })
      .setDraggable(true)
      .addTo(_this.map);
  });

  rotationMarkers.forEach((marker) => {
    marker.on('drag', (e) => handleDragRectangleRotationMarker(state, e));
    marker.on('dragend', () => {
      _this.map.fire('draw.update', { features: [_this.getFeature(state.featureId) as GeoJSON] });
      _this.changeMode('simple_select');
    });
  });

  return {
    rotationMarkers,
    rotationMarkerPositions,
  };
};

const createMarkerHtmlElement = (): HTMLDivElement => {
  const widthPx = 20,
    heightPx = 20;

  const svgTag = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${widthPx} ${heightPx}"><path d="${mdiRotateRight}"/></svg>`;

  const div = document.createElement('div');
  div.className = 'marker';
  div.style.backgroundImage = `url("data:image/svg+xml,${encodeURIComponent(svgTag)}")`;
  div.style.backgroundSize = '100%';
  div.style.width = `${widthPx}px`;
  div.style.height = `${heightPx}px`;
  div.style.display = 'block';
  div.style.border = 'none';
  div.style.borderRadius = '50%';
  div.style.cursor = 'pointer';
  div.style.padding = '0';
  return div;
};

const getAllMapGeoJsonFeatures = (map: mapboxgl.Map): Feature<Geometry, GeoJsonProperties>[] => {
  const sources = map.getStyle()!.sources;
  return Object.keys(sources)
    .map((sourceKey) => sources[sourceKey])
    .filter((source) => source.type === 'geojson')
    .map((geoJsonSource) => geoJsonSource.data)
    .filter(
      (geoJsonSourceData): geoJsonSourceData is GeoJSON<Geometry, GeoJsonProperties> =>
        typeof geoJsonSourceData === 'object',
    )
    .filter((geoJsonSourceData) => geoJsonSourceData.type === 'FeatureCollection')
    .flatMap((geoJsonSourceData) => geoJsonSourceData.features);
};

export const computeRectangleRotationMarkerPositions = (rectangleFeature: MapboxDraw.DrawPolygon): Position[] => {
  // find the midpoints of the rectangle's edges
  const rectangleCoordinates = rectangleFeature.getCoordinates()[0];
  const rectangleEdgeMidpoints: Position[] = [
    // only putting a marker above the top edge of the rectangle to simplify the drag interaction
    [rectangleCoordinates[0], rectangleCoordinates[1]],
  ].map(([start, end]) => {
    const midpoint = [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2];
    return midpoint;
  });

  // 2. determine the position of the rotation markers
  // add small gap so the rotation markers aren't right on the edge of the rectangle
  const rectangleCenter = center(rectangleFeature).geometry.coordinates as [number, number];
  const rotationMarkerPositions: Position[] = rectangleEdgeMidpoints.map((midpoint) => {
    const distanceFromCenterToMidpoint = distance(rectangleCenter, midpoint, { units: 'kilometers' });
    const bearingFromCenterToMidpoint = bearing(rectangleCenter, midpoint);
    return destination(rectangleCenter, distanceFromCenterToMidpoint * 1.25, bearingFromCenterToMidpoint).geometry
      .coordinates;
  });

  return rotationMarkerPositions;
};
