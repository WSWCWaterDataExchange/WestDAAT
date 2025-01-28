import { Feature, GeoJsonProperties, Point, Polygon, Position } from 'geojson';
import { generateCircleWithRadiusFromCenterPointToEdgePoint } from '../../../utilities/geometryHelpers';
import {
  CustomDirectSelectModeState,
  directSelectBaseMode,
  DirectSelectDrawModeInstance,
} from './CustomDirectSelectMode';
import { distance } from '@turf/distance';
import { center } from '@turf/center';
import { Marker } from 'mapbox-gl';
import { transformRotate } from '@turf/transform-rotate';
import bearing from '@turf/bearing';
import { computeRectangleRotationMarkerPositions } from './CustomDirectSelectModeSetupHelpers';
import MapboxDraw from '@mapbox/mapbox-gl-draw';

export const dragFeature = (
  _this: DirectSelectDrawModeInstance,
  state: CustomDirectSelectModeState,
  e: MapboxDraw.MapMouseEvent,
) => {
  // call base implementation, let it handle dragging the feature
  directSelectBaseMode.onDrag?.call(_this, state, e);

  // follow up with custom behavior
  if (state.feature?.properties?.isCircle) {
    handleCircleDragged(state);
  } else if (state.feature?.properties?.isRectangle) {
    handleRectangleDragged(state);
  }
};

const handleCircleDragged = (state: CustomDirectSelectModeState) => {
  // update state with the new center point of the circle
  state.customState.circleState.circleCenterPointLngLat = center(state.feature!).geometry.coordinates as [
    number,
    number,
  ];
};

const handleRectangleDragged = (state: CustomDirectSelectModeState) => {
  // update the corner points so they follow the dragged rectangle
  const updatedRectangleCoordinates = state.feature!.getCoordinates();
  state.customState.rectangleState.cornerFeatures.forEach((cornerFeature, index) => {
    cornerFeature.setCoordinates(updatedRectangleCoordinates[0][index]);
  });

  // update the rotation markers so they follow the dragged rectangle
  const updatedRotationMarkerPositions = computeRectangleRotationMarkerPositions(state.feature!);
  state.customState.rectangleState.rotationMarkers.forEach((marker, index) => {
    const newPosition = updatedRotationMarkerPositions[index];
    marker.setLngLat({ lng: newPosition[0], lat: newPosition[1] });
  });

  // update the rotation marker positions in state
  state.customState.rectangleState.rotationMarkersPreviousPositions =
    state.customState.rectangleState.rotationMarkers.map((marker) => marker.getLngLat().toArray());
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
  // resize the rectangle based on the dragged vertex
  const rectangle = state.feature!;

  // the drag event only gives us the mouse position.
  // we need to match that to the closest corner of the rectangle.
  // assume that the rectangle is rotated.
  const totalRotationAngle = state.customState.rectangleState.totalRotationAngle;

  // 1. undo the rotation of the rectangle
  const centerPosition = center(rectangle);
  const unrotatedRectangle = transformRotate(rectangle, -totalRotationAngle, {
    pivot: centerPosition,
  });
  const unrotatedRectangleCornerPositions = unrotatedRectangle.coordinates[0];

  // 2. undo the rotation of the drag position relative to the rectangle center
  const dragPosition = e.lngLat.toArray() as Position;
  const dragPositionGeometry: Point = {
    type: 'Point',
    coordinates: dragPosition,
  };
  const unrotatedDragPosition = transformRotate(dragPositionGeometry, -totalRotationAngle, {
    pivot: centerPosition,
  }).coordinates;

  // 3. find the closest corner of the unrotated rectangle to the unrotated drag position
  const selectedUnrotatedRectangleCornerPosition = findClosestPointToPoint(
    unrotatedDragPosition,
    unrotatedRectangleCornerPositions,
  );

  // also find the opposite corner
  const oppositeCornerIndex =
    (unrotatedRectangleCornerPositions.indexOf(selectedUnrotatedRectangleCornerPosition) + 2) % 4;
  const oppositeCorner = unrotatedRectangleCornerPositions[oppositeCornerIndex];

  // 4. compute the new rectangle coordinates
  const newRectangleCoordinates = computeNewRectangleCoordinates(unrotatedDragPosition, oppositeCorner);
  const newRectangleGeometry: Feature<Polygon, GeoJsonProperties> = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [newRectangleCoordinates],
    },
  };

  // 5. re-perform the rotation on the new rectangle coordinates
  const newRotatedRectangleCoordinates = transformRotate(newRectangleGeometry, totalRotationAngle, {
    pivot: centerPosition,
  }).geometry.coordinates[0];

  // 6. we did it! update the rectangle with the new coordinates
  rectangle.setCoordinates([newRotatedRectangleCoordinates]);

  // also update the coordinates for the corner markers so they re-render while dragging
  state.customState.rectangleState.cornerFeatures.forEach((cornerFeature, index) => {
    cornerFeature.setCoordinates(newRotatedRectangleCoordinates[index]);
  });

  // also update the coordinates for the rotation markers so they re-render while dragging
  const updatedRotationMarkerPositions = computeRectangleRotationMarkerPositions(rectangle);
  state.customState.rectangleState.rotationMarkers.forEach((marker, index) => {
    const newPosition = updatedRotationMarkerPositions[index];
    marker.setLngLat({ lng: newPosition[0], lat: newPosition[1] });
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

export const handleDragRectangleRotationMarker = (
  state: CustomDirectSelectModeState,
  e: { type: 'drag'; target: Marker },
) => {
  // find the difference in rotation angle from one frame to the next
  const rectangleCenter = center(state.feature!).geometry.coordinates as Position;
  const previousMarkerPosition = state.customState.rectangleState.rotationMarkersPreviousPositions[0];
  const newMarkerPosition = e.target.getLngLat().toArray() as Position;

  const previousRotationAngle = bearing(rectangleCenter, previousMarkerPosition);
  const newRotationAngle = bearing(rectangleCenter, newMarkerPosition);
  const normalizedRotationAngleDelta = normalizeRotationAngle(newRotationAngle - previousRotationAngle);

  // update the rectangle
  const rotatedRectangleDrawFeature: MapboxDraw.DrawPolygon = transformRotate(
    state.feature!,
    normalizedRotationAngleDelta,
    {
      pivot: rectangleCenter,
    },
  );
  state.feature!.setCoordinates(rotatedRectangleDrawFeature.coordinates);

  // update the rotation marker position for the next frame
  state.customState.rectangleState.rotationMarkersPreviousPositions[0] = newMarkerPosition;

  // update the corner markers so they re-render while dragging
  const rectangleCoordinates = rotatedRectangleDrawFeature.coordinates[0];
  state.customState.rectangleState.cornerFeatures.forEach((cornerFeature, index) => {
    cornerFeature.setCoordinates(rectangleCoordinates[index]);
  });

  // update the total rotation angle
  state.customState.rectangleState.totalRotationAngle = normalizeRotationAngle(
    state.customState.rectangleState.totalRotationAngle + normalizedRotationAngleDelta,
  );
};

const normalizeRotationAngle = (angle: number): number => {
  return (angle + 360) % 360;
};
