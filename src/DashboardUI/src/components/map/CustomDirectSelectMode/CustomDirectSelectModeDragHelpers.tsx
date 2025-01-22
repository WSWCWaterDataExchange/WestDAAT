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

export const dragFeature = (
  _this: DirectSelectDrawModeInstance,
  state: CustomDirectSelectModeState,
  e: MapboxDraw.MapMouseEvent,
) => {
  // call base implementation, let it handle the drag
  directSelectBaseMode.onDrag?.call(_this, state, e);

  if (state.feature?.properties?.isCircle) {
    // afterwards update the center point of the circle
    state.customState.circleState.circleCenterPointLngLat = center(state.feature).geometry.coordinates as [
      number,
      number,
    ];
  }
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
  const corners = rectangle.getCoordinates()[0];
  const activeCorner = findClosestPointToPoint(e.lngLat.toArray(), corners);
  const oppositeCornerIndex = (corners.indexOf(activeCorner) + 2) % 4;
  const oppositeCorner = corners[oppositeCornerIndex];

  activeCorner[0] = e.lngLat.lng;
  activeCorner[1] = e.lngLat.lat;

  const newRectangleCoordinates = computeNewRectangleCoordinates(activeCorner, oppositeCorner);

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
