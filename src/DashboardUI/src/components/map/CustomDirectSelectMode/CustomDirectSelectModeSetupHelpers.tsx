import { center } from '@turf/center';
import { CustomDirectSelectModeState, DirectSelectDrawModeInstance } from './CustomDirectSelectMode';
import { GeoJsonProperties, Geometry, GeoJSON, Feature, Point, Position } from 'geojson';
import { distance } from '@turf/distance';
import { bearing } from '@turf/bearing';
import { destination } from '@turf/destination';
import { Marker } from 'mapbox-gl';

export const handleSetupCircle = (state: CustomDirectSelectModeState) => {
  state.customState.circleState.circleCenterPointLngLat = center(state.feature!).geometry.coordinates as [
    number,
    number,
  ];
};

export const handleSetupRectangle = (_this: DirectSelectDrawModeInstance, state: CustomDirectSelectModeState) => {
  // get rectangle's child corner Point features
  // they aren't available directly as part of the polygon so we have to grab them in a roundabout way
  const sources = _this.map.getStyle()!.sources;
  const rectangleCornerFeatures = Object.keys(sources)
    .map((sourceKey) => sources[sourceKey])
    .filter((source) => source.type === 'geojson')
    .map((geoJsonSource) => geoJsonSource.data)
    .filter(
      (geoJsonSourceData): geoJsonSourceData is GeoJSON<Geometry, GeoJsonProperties> =>
        typeof geoJsonSourceData === 'object',
    )
    .filter((geoJsonSourceData) => geoJsonSourceData.type === 'FeatureCollection')
    .flatMap((geoJsonSourceData) => geoJsonSourceData.features)
    // the rectangle's child corner features are all Point geometries
    // find the relevant points corresponding to this rectangle
    .filter(
      (feature): feature is Feature<Point, GeoJsonProperties> => feature.properties?.parent === state.feature?.id,
    );

  // register the corner features in this draw mode and track them in state
  const rectangleCornerDrawFeatures = rectangleCornerFeatures.map((feature) => {
    const drawnFeature = _this.newFeature(feature) as MapboxDraw.DrawPoint;
    drawnFeature.setProperty('isCorner', true);
    return drawnFeature;
  });
  console.log('corner features', rectangleCornerDrawFeatures);

  // create the rotation features as well and track them
  // 1. find the midpoints of the rectangle's edges
  const rectangleCoordinates = state.feature!.getCoordinates()[0];
  const rectangleEdgeMidpoints: Position[] = [
    [rectangleCoordinates[0], rectangleCoordinates[1]],
    [rectangleCoordinates[1], rectangleCoordinates[2]],
    [rectangleCoordinates[2], rectangleCoordinates[3]],
    [rectangleCoordinates[3], rectangleCoordinates[0]],
  ].map(([start, end]) => {
    const midpoint = [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2];
    return midpoint;
  });

  // 2. determine the position of the rotation markers
  // add small gap so the rotation markers aren't right on the edge of the rectangle
  const rectangleCenter = center(state.feature!).geometry.coordinates as [number, number];
  const rotationMarkerPositions: Position[] = rectangleEdgeMidpoints.map((midpoint) => {
    const distanceFromCenterToMidpoint = distance(rectangleCenter, midpoint, { units: 'kilometers' });
    const bearingFromCenterToMidpoint = bearing(rectangleCenter, midpoint);
    return destination(rectangleCenter, distanceFromCenterToMidpoint * 1.25, bearingFromCenterToMidpoint).geometry
      .coordinates;
  });

  // 3. create marker features and track in state
  const rotationMarkers = rotationMarkerPositions.map((position) => {
    return new Marker({
      color: 'red',
    })
      .setLngLat({ lng: position[0], lat: position[1] })
      .setDraggable(true)
      .addTo(_this.map);
  });

  rotationMarkers.forEach((marker) => {
    marker.on('drag', (e: any) => {
      console.log(e, 'DRAGGING');
    });
  });

  state.customState.rectangleState = {
    cornerFeatures: rectangleCornerDrawFeatures,
    rotationMarkers: rotationMarkers,
  };
  console.log(state.feature, state.customState.rectangleState);
};
