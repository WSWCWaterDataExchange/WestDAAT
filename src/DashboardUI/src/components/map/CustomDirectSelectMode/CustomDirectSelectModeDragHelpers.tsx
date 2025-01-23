import { Position } from 'geojson';
import { generateCircleWithRadiusFromCenterPointToEdgePoint } from '../../../utilities/geometryHelpers';
import {
  CustomDirectSelectModeState,
  directSelectBaseMode,
  DirectSelectDrawModeInstance,
} from './CustomDirectSelectMode';
import { distance } from '@turf/distance';
import { bboxPolygon } from '@turf/bbox-polygon';
import { bbox } from '@turf/bbox';
import { center } from '@turf/center';
import { Marker } from 'mapbox-gl';
import { transformRotate } from '@turf/transform-rotate';
import bearing from '@turf/bearing';
import { computeRectangleRotationMarkerPositions } from './CustomDirectSelectModeSetupHelpers';

export const dragFeature = (
  _this: DirectSelectDrawModeInstance,
  state: CustomDirectSelectModeState,
  e: MapboxDraw.MapMouseEvent,
) => {
  // call base implementation, let it handle the drag
  directSelectBaseMode.onDrag?.call(_this, state, e);

  if (state.feature?.properties?.isCircle) {
    handleDragCircle(state, e);
  } else if (state.feature?.properties?.isRectangle) {
    handleDragRectangle(state, e);
  }
};

const handleDragCircle = (state: CustomDirectSelectModeState, e: MapboxDraw.MapMouseEvent) => {
  // afterwards update the center point of the circle
  state.customState.circleState.circleCenterPointLngLat = center(state.feature!).geometry.coordinates as [
    number,
    number,
  ];
};

const handleDragRectangle = (state: CustomDirectSelectModeState, e: MapboxDraw.MapMouseEvent) => {
  // update the corner features
  const updatedRectangleCoordinates = state.feature!.getCoordinates();
  state.customState.rectangleState.cornerFeatures.forEach((cornerFeature, index) => {
    cornerFeature.setCoordinates(updatedRectangleCoordinates[0][index]);
  });

  // update the rotation markers
  const updatedRotationMarkerPositions = computeRectangleRotationMarkerPositions(state.feature!);
  state.customState.rectangleState.rotationMarkers.forEach((marker, index) => {
    const newPosition = updatedRotationMarkerPositions[index];
    marker.setLngLat({ lng: newPosition[0], lat: newPosition[1] });
  });

  // update the rotation marker positions
  state.customState.rectangleState.rotationMarkerPositions = state.customState.rectangleState.rotationMarkers.map(
    (marker) => marker.getLngLat().toArray(),
  );
};

export const dragVertex = (
  _this: DirectSelectDrawModeInstance,
  state: CustomDirectSelectModeState,
  e: MapboxDraw.MapMouseEvent,
) => {
  // determine whether to override the drag behavior
  if (state.feature?.properties?.isCircle) {
    handleDragCircleVertex(state, e);
  } else if (state.feature?.properties?.isRectangle) {
    handleDragRectangleVertex(state, e);
  } else {
    directSelectBaseMode.onDrag?.call(_this, state, e);
  }
};

export const handleDragRectangleMarker = (state: CustomDirectSelectModeState, e: { type: 'drag'; target: Marker }) => {
  // find the difference in rotation angle from one frame to the next
  const rectangleCenter = center(state.feature!).geometry.coordinates as Position;
  const previousMarkerPosition = state.customState.rectangleState.rotationMarkerPositions[0];
  const newMarkerPosition = e.target.getLngLat().toArray() as Position;

  const previousRotationAngle = bearing(rectangleCenter, previousMarkerPosition);
  const newRotationAngle = bearing(rectangleCenter, newMarkerPosition);
  const rotationAngleDelta = newRotationAngle - previousRotationAngle;

  // update the rectangle
  const rotatedRectangleDrawFeature: MapboxDraw.DrawPolygon = transformRotate(state.feature!, rotationAngleDelta, {
    pivot: rectangleCenter,
  });
  state.feature!.setCoordinates(rotatedRectangleDrawFeature.coordinates);

  // update the rotation marker position for the next frame
  state.customState.rectangleState.rotationMarkerPositions[0] = newMarkerPosition;

  // update the corner markers so they re-render while dragging
  const rectangleCoordinates = rotatedRectangleDrawFeature.coordinates[0];
  state.customState.rectangleState.cornerFeatures.forEach((cornerFeature, index) => {
    cornerFeature.setCoordinates(rectangleCoordinates[index]);
  });
};

const handleDragCircleVertex = (state: CustomDirectSelectModeState, e: MapboxDraw.MapMouseEvent) => {
  // find new coordinate location via mouse position
  const newCoordPosition = e.lngLat;

  // generate new coordinates for the whole circle
  const newCoordinates = generateCircleWithRadiusFromCenterPointToEdgePoint(
    state.customState.circleState.circleCenterPointLngLat!,
    newCoordPosition.toArray(),
  );

  // overwrite the circles coordinates with the new coordinates
  state.feature?.setCoordinates(newCoordinates.geometry.coordinates);
};

const handleDragRectangleVertex = (state: CustomDirectSelectModeState, e: MapboxDraw.MapMouseEvent) => {
  const rectangle = state.feature!;

  // find the closest corner to the dragged vertex
  const rectangleMarkerPositions = rectangle.getCoordinates()[0];
  const dragPosition = e.lngLat.toArray() as Position;
  const selectedMarkerPosition = findClosestPointToPoint(dragPosition, rectangleMarkerPositions);

  // also find the opposite corner
  const oppositeCornerIndex = (rectangleMarkerPositions.indexOf(selectedMarkerPosition) + 2) % 4;
  const oppositeCorner = rectangleMarkerPositions[oppositeCornerIndex];

  // build the four corners of the rectangle using these two opposing corners
  const newRectangleCoordinates = computeNewRectangleCoordinates(dragPosition, oppositeCorner);

  // update the rectangle with the new coordinates
  const newRectangleGeometry = bboxPolygon(
    bbox({
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [newRectangleCoordinates],
      },
    }),
  );
  rectangle.setCoordinates(newRectangleGeometry.geometry.coordinates);

  // also update the coordinates for the corner markers so they re-render while dragging
  state.customState.rectangleState.cornerFeatures.forEach((cornerFeature, index) => {
    cornerFeature.setCoordinates(newRectangleCoordinates[index]);
  });
};

const findClosestPointToPoint = (newPoint: Position, points: Position[]): Position => {
  return points
    .map((point) => ({
      point,
      distance: distance(newPoint, point, { units: 'kilometers' }),
    }))
    .reduce((prevPoint, currentPoint) => (prevPoint.distance < currentPoint.distance ? prevPoint : currentPoint)).point;
};

const computeNewRectangleCoordinates = (activeCorner: Position, oppositeCorner: Position): Position[] => {
  const [lng1, lat1] = activeCorner;
  const [lng2, lat2] = oppositeCorner;

  return [
    [lng1, lat1],
    [lng2, lat1],
    [lng2, lat2],
    [lng1, lat2],
  ];
};
