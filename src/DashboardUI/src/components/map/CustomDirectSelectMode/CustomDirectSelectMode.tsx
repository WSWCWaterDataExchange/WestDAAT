import MapboxDraw, { DrawCustomMode, DrawCustomModeThis } from '@mapbox/mapbox-gl-draw';
import { LngLat, Marker } from 'mapbox-gl';
import { Feature, GeoJSON, GeoJsonProperties, Geometry, Position } from 'geojson';
import { dragFeature, dragVertex } from './CustomDirectSelectModeDragHelpers';
import { handleDisplayCircle, handleDisplayRectangle } from './CustomDirectSelectModeDisplayHelpers';
import { handleSetupCircle, handleSetupRectangle } from './CustomDirectSelectModeSetupHelpers';

// base code used for reference: https://github.com/mapbox/mapbox-gl-draw/blob/main/src/modes/direct_select.js

export const directSelectBaseMode = MapboxDraw.modes.direct_select;

export interface CustomDirectSelectModeState {
  customState: {
    circleState: {
      circleCenterPointLngLat: [number, number] | undefined;
    };
    rectangleState: {
      cornerFeatures: MapboxDraw.DrawPoint[];
      rotationMarkers: Marker[];
      rotationMarkerPositions: Position[];
      totalRotationAngle: number;
    };
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
  circleState: {
    circleCenterPointLngLat: undefined,
  },
  rectangleState: {
    cornerFeatures: [],
    rotationMarkers: [],
    rotationMarkerPositions: [],
    totalRotationAngle: 0,
  },
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
      handleSetupCircle(state);
    } else if (state.feature?.properties?.isRectangle) {
      handleSetupRectangle(this, state);
    }

    return state;
  },

  onStop: function (state: CustomDirectSelectModeState) {
    directSelectBaseMode.onStop?.call(this, state);

    if (state.feature?.properties?.isRectangle) {
      state.customState.rectangleState.rotationMarkers.forEach((marker) => marker.remove());
    }
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
    // determine whether to override the base implementation
    if (state.feature?.properties?.isCircle && state.featureId === geojson.properties?.id) {
      handleDisplayCircle(state, geojson, display);
    } else if (state.feature?.properties?.isRectangle && state.featureId === geojson.properties?.id) {
      handleDisplayRectangle(this, state, geojson, display);
    } else {
      // call base implementation
      directSelectBaseMode.toDisplayFeatures?.call(this, state, geojson, display);
    }
  },
};
