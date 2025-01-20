import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { DrawCustomMode } from '@mapbox/mapbox-gl-draw';
import { GeoJSON } from 'geojson';

const selectMode = MapboxDraw.modes.simple_select;

interface CircleSelectModeState {
  canDragMove: boolean;
  dragMoveLocation: GeoJSON.Position | null; //?
  dragMoving: boolean;
  featureId: string;
  feature: GeoJSON.Feature | null | undefined; //?
  selectedCoordPaths: string[];
  [key: string]: any; // unknown properties
}

export const CustomCircleSelectMode: DrawCustomMode = {
  ...selectMode,
  onSetup: function (opts: any): CircleSelectModeState {
    const state = selectMode.onSetup?.call(this, opts);
    console.log('state', state);
    return state;
  },

  onDrag: function (state: CircleSelectModeState, e: any) {
    console.log('onDrag', state, e);
    selectMode.onDrag?.call(this, state, e);
  },
};
