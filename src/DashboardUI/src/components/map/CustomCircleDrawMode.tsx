import MapboxDraw, { DrawCustomMode, MapMouseEvent } from '@mapbox/mapbox-gl-draw';
import circle from '@turf/circle';
import distance from '@turf/distance';
import { Feature, GeoJSON, GeoJsonProperties, Polygon } from 'geojson';

interface CircleDrawModeState {
  inProgressCircleCenterPoint: [number, number] | undefined;
}

const defaultState = (): CircleDrawModeState => ({
  inProgressCircleCenterPoint: undefined,
});

export const CustomCircleDrawMode: DrawCustomMode = {
  // inherit functionality from existing polygon draw tool
  ...MapboxDraw.modes.draw_polygon,

  onSetup: function (opts: any): CircleDrawModeState {
    // Initialization logic for your custom mode
    return defaultState();
  },

  onClick: function (state: CircleDrawModeState, e: MapMouseEvent) {
    const circleHasBeenStarted = state.inProgressCircleCenterPoint !== undefined;

    const coords = e.lngLat.toArray();
    if (circleHasBeenStarted) {
      const circle = generateCircleWithRadiusFromCenterPointToEdgePoint(state.inProgressCircleCenterPoint!, coords);
      const circleFeature = this.newFeature({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: circle.geometry.coordinates,
        },
      });
      this.addFeature(circleFeature);
    } else {
      state.inProgressCircleCenterPoint = coords;
    }
  },

  onMouseMove: function (state: CircleDrawModeState, e: MapMouseEvent) {
    // Handle mouse movement
  },

  onKeyUp: function (state: CircleDrawModeState, e: KeyboardEvent) {
    // Handle keyboard input if needed
  },

  onStop: function (state: CircleDrawModeState) {
    // Cleanup when the mode ends
  },

  // Required: Get the features your mode is managing
  toDisplayFeatures: function (state, geojson: GeoJSON, display: (feature: GeoJSON) => void) {
    display(geojson); // Pass features to Mapbox Draw to render
  },
};

type CircleFeature = Feature<Polygon, GeoJsonProperties>;

const generateCircleWithRadiusFromCenterPointToEdgePoint = (
  circleCenterPoint: number[],
  circleEdgePoint: number[],
): CircleFeature => {
  const distanceFromCenterToEdgeInKm = distance(circleCenterPoint, circleEdgePoint, {
    units: 'kilometers',
  });
  return circle(circleCenterPoint, distanceFromCenterToEdgeInKm, { steps: 100 });
};
