import MapboxDraw, { DrawCustomMode } from '@mapbox/mapbox-gl-draw';
import center from '@turf/center';
import { LngLat } from 'mapbox-gl';

const baseMode = MapboxDraw.modes.direct_select;

interface CircleSelectModeState {
  customState: {
    isCircle: boolean;
    circleState: {
      circleCenterPoint: [number, number] | undefined;
    };
  };
  // inherited properties
  canDragMove: boolean;
  dragMoveLocation: LngLat;
  dragMoving: boolean;
  featureId: string;
  feature: GeoJSON.Feature | null | undefined; //?
  selectedCoordPaths: string[];
}

const defaultCustomState: CircleSelectModeState['customState'] = {
  isCircle: false,
  circleState: {
    circleCenterPoint: undefined,
  },
};

// DrawCustomMode type definition doesn't allow for extending the type with additional properties
// although the js implementation of `direct_select` does exactly that
export const CustomDirectSelectMode: DrawCustomMode & { [key: string]: any } = {
  ...baseMode,

  onSetup: function (opts): CircleSelectModeState {
    // initialize state
    const state: CircleSelectModeState = baseMode.onSetup?.call(this, opts);
    state.customState = defaultCustomState;

    if (state.feature?.properties?.isCircle) {
      state.customState.circleState.circleCenterPoint = center(state.feature).geometry.coordinates as [number, number];
      console.log('center point', state.customState.circleState.circleCenterPoint);
    }

    return state;
  },

  onDrag: function (state: CircleSelectModeState, e: MapboxDraw.MapMouseEvent) {
    // validation copied from base implementation
    if (state.canDragMove !== true) return;
    state.dragMoving = true;
    e.originalEvent.stopPropagation();

    // determine whether to call base implementation or custom implementation
    if (state.selectedCoordPaths.length > 0) {
      const delta = new LngLat(e.lngLat.lng - state.dragMoveLocation.lng, e.lngLat.lat - state.dragMoveLocation.lat);
      this.dragVertex(state, e, delta);
    } else {
      // drag feature
      // call base implementation, let it handle the drag
      baseMode.onDrag?.call(this, state, e);

      if (state.feature?.properties?.isCircle) {
        // afterwards update the center point of the circle
        state.customState.circleState.circleCenterPoint = center(state.feature).geometry.coordinates as [
          number,
          number,
        ];
        console.log('center point updated', state.customState.circleState.circleCenterPoint);
      }
    }

    // post-processing copied from base implementation
    state.dragMoveLocation = e.lngLat;
  },

  dragVertex: (state: CircleSelectModeState, e: MapboxDraw.MapMouseEvent, delta: LngLat) => {
    // not calling base mode dragVertex, overwriting entirely
    console.log('dragging vertex', state, e, delta);
  },
};
