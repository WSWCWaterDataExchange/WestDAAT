import MapboxDraw, { DrawCustomMode } from '@mapbox/mapbox-gl-draw';
import { Feature, GeoJSON, GeoJsonProperties, Geometry } from 'geojson';
import bboxPolygon from '@turf/bbox-polygon';

interface RectangleDrawModeState {
  rectangleDrawFeature: MapboxDraw.DrawFeature | undefined;
  firstPointCoords: [number, number] | undefined;
}

const defaultState = (): RectangleDrawModeState => ({
  rectangleDrawFeature: undefined,
  firstPointCoords: undefined,
});

export const CustomRectangleDrawMode: DrawCustomMode = {
  // inherit functionality from existing polygon draw tool
  ...MapboxDraw.modes.draw_polygon,

  onSetup: function (opts: any): RectangleDrawModeState {
    // Initialization logic for your custom mode
    const rectangleFeature: Feature<Geometry, GeoJsonProperties> = {
      type: 'Feature',
      properties: {
        isRectangle: true,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[]],
      },
    };
    const rectangleDrawFeature = this.newFeature(rectangleFeature);

    const state = defaultState();
    state.rectangleDrawFeature = rectangleDrawFeature;
    return state;
  },

  onClick: function (state: RectangleDrawModeState, e: MapboxDraw.MapMouseEvent) {
    const mouseClickCoords = e.lngLat.toArray();

    if (!state.firstPointCoords) {
      // place the first point
      state.firstPointCoords = mouseClickCoords;
    } else {
      // finalize the rectangle
      const [minx, miny] = state.firstPointCoords;
      const [maxx, maxy] = mouseClickCoords;

      const rectangleFeature = bboxPolygon([minx, miny, maxx, maxy]);
      const rectangleDrawFeature = this.newFeature(rectangleFeature);
      this.addFeature(rectangleDrawFeature);

      // exit rectangle drawing mode
      this.map.fire('draw.create', { features: [rectangleDrawFeature] });
      this.changeMode('simple_select');
    }
  },

  onMouseMove: function (state: RectangleDrawModeState, e: MapboxDraw.MapMouseEvent) {
    // temp - do nothing
  },

  onStop: function (state: RectangleDrawModeState) {
    // no cleanup needed. we do want to leave this method in place to prevent the default behavior though
  },

  toDisplayFeatures: function (state: any, geojson: GeoJSON, display: (geojson: GeoJSON) => void): void {
    display(geojson);
  },
};
