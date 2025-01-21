import MapboxDraw, { DrawCustomMode } from '@mapbox/mapbox-gl-draw';
import { GeoJSON } from 'geojson';

interface RectangleDrawModeState {
  firstCornerPoint: [number, number] | undefined;
  secondCornerPoint: [number, number] | undefined;
  thirdCornerPoint: [number, number] | undefined;
  fourthCornerPoint: [number, number] | undefined;
  inProgressRectangleId: string | undefined;
}

const defaultState = (): RectangleDrawModeState => ({
  firstCornerPoint: undefined,
  secondCornerPoint: undefined,
  thirdCornerPoint: undefined,
  fourthCornerPoint: undefined,
  inProgressRectangleId: undefined,
});

export const CustomRectangleDrawMode: DrawCustomMode = {
  // inherit functionality from existing polygon draw tool
  ...MapboxDraw.modes.draw_polygon,

  onSetup: function (opts: any): RectangleDrawModeState {
    // Initialization logic for your custom mode
    return defaultState();
  },

  toDisplayFeatures: function (state: any, geojson: GeoJSON, display: (geojson: GeoJSON) => void): void {
    display(geojson);
  },
};
