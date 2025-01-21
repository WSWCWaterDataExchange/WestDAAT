import MapboxDraw, { DrawCustomMode } from '@mapbox/mapbox-gl-draw';
import { GeoJSON } from 'geojson';
import { generatePointAtCoords } from '../../utilities/geometryHelpers';

interface RectangleDrawModeState {
  firstCornerPoint: [number, number] | undefined;
  firstCornerPointId: string | undefined;
  secondCornerPoint: [number, number] | undefined;
  secondCornerPointId: string | undefined;
  thirdCornerPoint: [number, number] | undefined;
  thirdCornerPointId: string | undefined;
  fourthCornerPoint: [number, number] | undefined;
  fourthCornerPointId: string | undefined;
}

const defaultState = (): RectangleDrawModeState => ({
  firstCornerPoint: undefined,
  firstCornerPointId: undefined,
  secondCornerPoint: undefined,
  secondCornerPointId: undefined,
  thirdCornerPoint: undefined,
  thirdCornerPointId: undefined,
  fourthCornerPoint: undefined,
  fourthCornerPointId: undefined,
});

export const CustomRectangleDrawMode: DrawCustomMode = {
  // inherit functionality from existing polygon draw tool
  ...MapboxDraw.modes.draw_polygon,

  onSetup: function (opts: any): RectangleDrawModeState {
    // Initialization logic for your custom mode
    return defaultState();
  },

  onClick: function (state: RectangleDrawModeState, e: MapboxDraw.MapMouseEvent) {
    const mouseClickCoords = e.lngLat.toArray();

    if (!state.firstCornerPoint) {
      const point = generatePointAtCoords(mouseClickCoords);
      const pointFeature = this.newFeature(point);
      this.addFeature(pointFeature);

      state.firstCornerPoint = mouseClickCoords;
      state.firstCornerPointId = String(pointFeature.id);
    }
  },

  onMouseMove: function (state: RectangleDrawModeState, e: MapboxDraw.MapMouseEvent) {
    // temp - do nothing
  },

  toDisplayFeatures: function (state: any, geojson: GeoJSON, display: (geojson: GeoJSON) => void): void {
    display(geojson);
  },
};
