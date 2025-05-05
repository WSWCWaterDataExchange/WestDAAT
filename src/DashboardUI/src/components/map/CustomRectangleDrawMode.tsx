import MapboxDraw, { DrawCustomMode } from '@mapbox/mapbox-gl-draw';
import { GeoJSON } from 'geojson';
import bboxPolygon from '@turf/bbox-polygon';
import { buildDefaultNewRectangleFeature } from '../../utilities/customMapShapesUtility';

interface RectangleDrawModeState {
  rectangleDrawFeature: MapboxDraw.DrawPolygon | undefined;
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
    const rectangleFeature = buildDefaultNewRectangleFeature();
    const rectangleDrawFeature = this.newFeature(rectangleFeature) as MapboxDraw.DrawPolygon;
    this.addFeature(rectangleDrawFeature);

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
      // rectangle is done. exit rectangle drawing mode
      this.map.fire('draw.create', { features: [state.rectangleDrawFeature!] });
      this.changeMode('simple_select');
    }
  },

  onMouseMove: function (state: RectangleDrawModeState, e: MapboxDraw.MapMouseEvent) {
    const rectangleHasBeenStarted = state.firstPointCoords !== undefined;
    if (!rectangleHasBeenStarted) {
      return;
    }

    // update the rectangle feature with the new coordinates
    const mouseClickCoords = e.lngLat.toArray();

    const [minx, miny] = state.firstPointCoords!;
    const [maxx, maxy] = mouseClickCoords;

    const rectangleFeature = bboxPolygon([minx, miny, maxx, maxy]);

    state.rectangleDrawFeature!.setCoordinates(rectangleFeature.geometry.coordinates);
  },

  onStop: function (state: RectangleDrawModeState) {
    // clean up: we need may need to remove the rectangle feature from the map.
    // This is because we called `this.addFeature` in `onSetup`, which adds the feature to the map.

    // check if feature has been deleted
    if (!state.rectangleDrawFeature || !this.getFeature((state.rectangleDrawFeature.id ?? '') as string)) {
      return;
    }

    // if feature is valid, add to map
    // else delete and switch back to default draw mode
    if (state.rectangleDrawFeature.isValid()) {
      this.map.fire('draw.create', {
        features: [state.rectangleDrawFeature],
      });
    } else {
      this.deleteFeature(state.rectangleDrawFeature.id as string, { silent: true });
      this.changeMode('simple_select', {}, { silent: true });
    }
  },

  toDisplayFeatures: function (state: any, geojson: GeoJSON, display: (geojson: GeoJSON) => void): void {
    display(geojson);
  },
};
