import MapboxDraw, { DrawCustomMode, DrawCustomModeThis } from '@mapbox/mapbox-gl-draw';
import center from '@turf/center';
import { LngLat } from 'mapbox-gl';
import { Feature, GeoJSON, GeoJsonProperties, Geometry, Position } from 'geojson';
import { dragFeature, dragVertex } from './CustomDirectSelectModeDragHelpers';

// base code used for reference: https://github.com/mapbox/mapbox-gl-draw/blob/main/src/modes/direct_select.js

export const directSelectBaseMode = MapboxDraw.modes.direct_select;

export interface CustomDirectSelectModeState {
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

export type DirectSelectDrawModeInstance = DrawCustomMode & DrawCustomModeThis;

// DrawCustomMode type definition doesn't allow for extending the type with additional properties
// although the js implementation of `direct_select` does exactly that
export const CustomDirectSelectMode: DrawCustomMode = {
  ...directSelectBaseMode,

  // when a polygon is clicked on, this method is called to initialize the state
  onSetup: function (opts): CustomDirectSelectModeState {
    const state: CustomDirectSelectModeState = directSelectBaseMode.onSetup?.call(this, opts);
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

    // determine whether to move the whole feature or just a vertex
    if (state.selectedCoordPaths.length > 0) {
      dragVertex(this, state, e);
    } else {
      dragFeature(this, state, e);
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
    } else if (state.feature?.properties?.isRectangle && state.featureId === geojson.properties?.id) {
      // override rendering - default polygon tool displays midpoint markers which we don't want
      // display the rectangle feature
      geojson.properties.active = 'true';
      display(geojson);

      // render marker points manually rather than add them to the map's feature collection
      const rectangle = state.feature;
      const corners = rectangle.getCoordinates()[0];
      corners.map((position) => buildVertex(geojson.properties!.id, position)).forEach((vertex) => display(vertex));
    } else {
      // call base implementation
      directSelectBaseMode.toDisplayFeatures?.call(this, state, geojson, display);
    }
  },
};
