import MapboxDraw, { DrawCustomMode, MapMouseEvent } from '@mapbox/mapbox-gl-draw';
import circle from '@turf/circle';
import distance from '@turf/distance';
import { Feature, GeoJSON, GeoJsonProperties, Polygon } from 'geojson';

type CircleFeature = Feature<Polygon, GeoJsonProperties>;

interface CircleDrawModeState {
  inProgressCircleCenterPoint: [number, number] | undefined;
  inProgressCircleId: string | undefined;
}

const defaultState = (): CircleDrawModeState => ({
  inProgressCircleCenterPoint: undefined,
  inProgressCircleId: undefined,
});

export const CustomCircleDrawMode: DrawCustomMode = {
  // inherit functionality from existing polygon draw tool
  ...MapboxDraw.modes.draw_polygon,

  onSetup: function (opts: any): CircleDrawModeState {
    // Initialization logic for your custom mode
    return defaultState();
  },

  onClick: function (state: CircleDrawModeState, e: MapMouseEvent) {
    const coords = e.lngLat.toArray();
    const circleHasBeenStarted = state.inProgressCircleCenterPoint !== undefined;

    if (!circleHasBeenStarted) {
      // starting a new circle
      // set the center point
      state.inProgressCircleCenterPoint = coords;
    } else {
      // finish the circle
      // unset the id
      state.inProgressCircleId = undefined;

      // unset the center point
      state.inProgressCircleCenterPoint = undefined;
    }
  },

  onMouseMove: function (state: CircleDrawModeState, e: MapMouseEvent) {
    const coords = e.lngLat.toArray();
    const circleHasBeenStarted = state.inProgressCircleCenterPoint !== undefined;

    if (!circleHasBeenStarted) {
      return;
    }

    // render the in-progress circle:
    // delete the existing one, render a new one
    this.deleteFeature(state.inProgressCircleId!);

    const circle = generateCircleWithRadiusFromCenterPointToEdgePoint(state.inProgressCircleCenterPoint!, coords);
    const circleFeature = this.newFeature({
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: circle.geometry.coordinates,
      },
    });

    // newFeature generates an id for the feature automatically; track it:
    state.inProgressCircleId = String(circleFeature.id);
    this.addFeature(circleFeature);

    console.log('circleFeature', circleFeature);
    circleFeature.setProperty('radius', distance(state.inProgressCircleCenterPoint!, coords, { units: 'kilometers' }));
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

const generateCircleWithRadiusFromCenterPointToEdgePoint = (
  circleCenterPoint: number[],
  circleEdgePoint: number[],
): CircleFeature => {
  const distanceFromCenterToEdgeInKm = distance(circleCenterPoint, circleEdgePoint, {
    units: 'kilometers',
  });
  return circle(circleCenterPoint, distanceFromCenterToEdgeInKm, { steps: 100 });
};
