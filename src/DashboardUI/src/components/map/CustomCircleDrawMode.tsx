import MapboxDraw, { DrawCustomMode, MapMouseEvent } from '@mapbox/mapbox-gl-draw';
import { GeoJSON } from 'geojson';

export const CustomCircleDrawMode: DrawCustomMode = {
  // inherit functionality from existing polygon draw tool
  ...MapboxDraw.modes.draw_polygon,

  onSetup: (opts) => {
    // Initialization logic for your custom mode
    console.log('setup draw mode');
    return { ...opts }; // Return any state your mode needs
  },

  onClick: (state: any, e: MapMouseEvent) => {
    // Handle mouse click events
    console.log('click');
  },

  onMouseMove: (state: any, e: MapMouseEvent) => {
    // Handle mouse movement
  },

  onKeyUp: (state: any, e: KeyboardEvent) => {
    // Handle keyboard input if needed
  },

  onStop: (state: any) => {
    // Cleanup when the mode ends
  },

  // Required: Get the features your mode is managing
  toDisplayFeatures: (state, geojson: GeoJSON, display: (feature: GeoJSON) => void) => {
    display(geojson); // Pass features to Mapbox Draw to render
  },
};
