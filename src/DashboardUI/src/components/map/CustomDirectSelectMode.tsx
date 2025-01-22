import MapboxDraw, { DrawCustomMode } from '@mapbox/mapbox-gl-draw';
import center from '@turf/center';
import { LngLat } from 'mapbox-gl';
import {
  Feature,
  FeatureCollection,
  GeoJSON,
  GeoJsonProperties,
  Geometry,
  MultiPolygon,
  Point,
  Polygon,
  Position,
} from 'geojson';
import { generateCircleWithRadiusFromCenterPointToEdgePoint } from '../../utilities/geometryHelpers';
import bboxPolygon from '@turf/bbox-polygon';
import combine from '@turf/combine';
import bbox from '@turf/bbox';

// base code used for reference: https://github.com/mapbox/mapbox-gl-draw/blob/main/src/modes/direct_select.js

const baseMode = MapboxDraw.modes.direct_select;

interface CustomDirectSelectModeState {
  customState: {
    isCircle: boolean;
    circleState: {
      circleCenterPointLngLat: [number, number] | undefined;
    };
    isRectangle: boolean;
  };
  // inherited properties from base implementation
  canDragMove: boolean;
  dragMoveLocation: LngLat;
  dragMoving: boolean;
  featureId: string;
  feature: MapboxDraw.DrawPolygon | null | undefined; //?
  selectedCoordPaths: string[];
}

const defaultCustomState: CustomDirectSelectModeState['customState'] = {
  isCircle: false,
  circleState: {
    circleCenterPointLngLat: undefined,
  },
  isRectangle: false,
};

// DrawCustomMode type definition doesn't allow for extending the type with additional properties
// although the js implementation of `direct_select` does exactly that
export const CustomDirectSelectMode: DrawCustomMode = {
  ...baseMode,

  // when a polygon is clicked on, this method is called to initialize the state
  onSetup: function (opts): CustomDirectSelectModeState {
    const state: CustomDirectSelectModeState = baseMode.onSetup?.call(this, opts);
    state.customState = defaultCustomState;

    if (state.feature?.properties?.isCircle) {
      state.customState.circleState.circleCenterPointLngLat = center(state.feature).geometry.coordinates as [
        number,
        number,
      ];
    }

    return state;
  },

  onDrag: function (state: CustomDirectSelectModeState, e: MapboxDraw.MapMouseEvent) {
    // validation copied from base implementation
    if (state.canDragMove !== true) return;
    state.dragMoving = true;
    e.originalEvent.stopPropagation();

    const dragFeature = () => {
      // call base implementation, let it handle the drag
      baseMode.onDrag?.call(this, state, e);

      if (state.feature?.properties?.isCircle) {
        // afterwards update the center point of the circle
        state.customState.circleState.circleCenterPointLngLat = center(state.feature).geometry.coordinates as [
          number,
          number,
        ];
      }
    };

    const dragVertex = (e: MapboxDraw.MapMouseEvent) => {
      // determine whether to override the drag behavior
      if (state.feature?.properties?.isCircle) {
        // find new coordinate location via mouse position
        const newCoordPosition = e.lngLat;

        // generate new coordinates for the whole circle
        const newCoordinates = generateCircleWithRadiusFromCenterPointToEdgePoint(
          state.customState.circleState.circleCenterPointLngLat!,
          newCoordPosition.toArray(),
        );

        // overwrite the circles coordinates with the new coordinates
        state.feature?.setCoordinates(newCoordinates.geometry.coordinates);
      } else if (state.feature?.properties?.isRectangle) {
        // find the corner being dragged
        console.log('dragging rectangle', state.feature);
        const vertexBeingDraggedPosition = state.feature.getCoordinate(state.selectedCoordPaths[0]);
        const [vertexLng, vertexLat] = vertexBeingDraggedPosition;

        const [centerLng, centerLat] = center(state.feature).geometry.coordinates as [number, number];

        // determine which corner this is
        // latitude: -90 at south pole to +90 at north pole
        // longitude: -180 to +180 at international date line. 0 at prime meridian (greenwich, great britain)
        const isTopLeft = vertexLng < centerLng && vertexLat > centerLat;
        const isTopRight = vertexLng > centerLng && vertexLat > centerLat;
        const isBottomLeft = vertexLng < centerLng && vertexLat < centerLat;
        const isBottomRight = vertexLng > centerLng && vertexLat < centerLat;

        console.log(state.feature.getCoordinates());

        let oppositeCornerLng: number = 0,
          oppositeCornerLat: number = 0;
        if (isTopLeft) {
          console.log('top left');
          const bottomRightCorner = state.feature
            .getCoordinates()[0]
            .filter((coord) => coord[0] > centerLng && coord[1] > centerLat)[0];
          oppositeCornerLng = bottomRightCorner[0];
          oppositeCornerLat = bottomRightCorner[1];
        } else if (isTopRight) {
          console.log('top right');
          const bottomLeftCorner = state.feature
            .getCoordinates()[0]
            .filter((coord) => coord[0] < centerLng && coord[1] > centerLat)[0];
          oppositeCornerLng = bottomLeftCorner[0];
          oppositeCornerLat = bottomLeftCorner[1];
        } else if (isBottomLeft) {
          console.log('bottom left');
          const topRightCorner = state.feature
            .getCoordinates()[0]
            .filter((coord) => coord[0] > centerLng && coord[1] < centerLat)[0];
          oppositeCornerLng = topRightCorner[0];
          oppositeCornerLat = topRightCorner[1];
        } else if (isBottomRight) {
          console.log('bottom right');
          const topLeftCorner = state.feature
            .getCoordinates()[0]
            .filter((coord) => coord[0] < centerLng && coord[1] < centerLat)[0];
          oppositeCornerLng = topLeftCorner[0];
          oppositeCornerLat = topLeftCorner[1];
        } else {
          console.log('how did we get here');
        }

        // create a new rectangle using the opposite corner and the current mouse position as the bounding box
        const updatedRectangleGeometry = bboxPolygon([
          oppositeCornerLng,
          oppositeCornerLat,
          e.lngLat.lng,
          e.lngLat.lat,
        ]);
        state.feature.setCoordinates(updatedRectangleGeometry.geometry.coordinates);
      } else {
        baseMode.onDrag?.call(this, state, e);
      }
    };

    // determine whether to move the whole feature or just a vertex
    if (state.selectedCoordPaths.length > 0) {
      dragVertex(e);
    } else {
      dragFeature();
    }

    // post-processing copied from base implementation
    state.dragMoveLocation = e.lngLat;
  },

  toDisplayFeatures: function (
    state: CustomDirectSelectModeState,
    geojson: Feature<Geometry, GeoJsonProperties>,
    display: (geojson: GeoJSON) => void,
  ) {
    const getCardinalDirectionCoordinatesOnFeature = (): Position[] => {
      // technically this gets the coordinates that align *most closely* with the cardinal directions
      // but the distinction doesn't really matter for a circle containing a sufficient number of points
      const allCoordinateLngLatValues = state.feature!.getCoordinates()[0];
      const north = allCoordinateLngLatValues.reduce((prevCoord, currentCoord) =>
        prevCoord[1] > currentCoord[1] ? prevCoord : currentCoord,
      );
      const east = allCoordinateLngLatValues.reduce((prevCoord, currentCoord) =>
        prevCoord[0] > currentCoord[0] ? prevCoord : currentCoord,
      );
      const south = allCoordinateLngLatValues.reduce((prevCoord, currentCoord) =>
        prevCoord[1] < currentCoord[1] ? prevCoord : currentCoord,
      );
      const west = allCoordinateLngLatValues.reduce((prevCoord, currentCoord) =>
        prevCoord[0] < currentCoord[0] ? prevCoord : currentCoord,
      );
      return [north, east, south, west];
    };

    const buildVertex = (parentId: string, coordinates: Position): Feature<Geometry, GeoJsonProperties> => ({
      type: 'Feature',
      properties: {
        meta: 'vertex',
        parent: parentId,
        coord_path: '0.0',
        active: 'true',
      },
      geometry: {
        type: 'Point',
        coordinates: [coordinates[0], coordinates[1]],
      },
    });

    // determine whether to override the base implementation
    if (state.feature?.properties?.isCircle && state.featureId === geojson.properties?.id) {
      // display the circle feature
      geojson.properties.active = 'true';
      display(geojson);

      // render marker points manually rather than add them to the map's feature collection
      const draggableMarkerPositions = getCardinalDirectionCoordinatesOnFeature();
      draggableMarkerPositions
        .map((position) => buildVertex(geojson.properties!.id, position))
        .forEach((vertex) => display(vertex));
    } else {
      // call base implementation
      baseMode.toDisplayFeatures?.call(this, state, geojson, display);
    }
  },
};
