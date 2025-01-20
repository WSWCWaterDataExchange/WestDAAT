import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { DrawCustomMode } from '@mapbox/mapbox-gl-draw';
import { GeoJSON } from 'geojson';

export const CustomCircleSelectMode: DrawCustomMode = {
  ...MapboxDraw.modes.simple_select,
  toDisplayFeatures: function (state: any, geojson: GeoJSON, display: (feature: GeoJSON) => void) {
    console.log('display using custom circle mode', state);
    display(geojson);
  },
};
