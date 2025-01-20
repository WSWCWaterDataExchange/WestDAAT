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
      // settimeout allows us to remove the `isInProgress` flag after the circle finishes rendering,
      // thus preventing an overlapping click event from editing the circle via the same click that finishes it
      const inProgressCircleId = state.inProgressCircleId!;
      setTimeout(() => {
        const feature = this.getFeature(inProgressCircleId);
        feature.setProperty('isInProgress', false);
        this.map.fire('draw.create', { features: [feature] });
      }, 0);

      // unset the id
      state.inProgressCircleId = undefined;

      // unset the center point
      state.inProgressCircleCenterPoint = undefined;

      this.changeMode('simple_select');
    }
  },

  onMouseMove: function (state: CircleDrawModeState, e: MapMouseEvent) {
    const coords = e.lngLat.toArray();
    const circleHasBeenStarted = state.inProgressCircleCenterPoint !== undefined;

    if (!circleHasBeenStarted) {
      return;
    }

    // render the in-progress circle:
    let circleFeature = this.getFeature(state.inProgressCircleId ?? '');

    // generate the new geometry
    const circle = generateCircleWithRadiusFromCenterPointToEdgePoint(state.inProgressCircleCenterPoint!, coords);

    if (!circleFeature) {
      // create new circle feature if it doesn't exist
      circleFeature = this.newFeature({
        type: 'Feature',
        properties: {
          isCircle: true,
          isInProgress: true,
        },
        geometry: {
          type: 'Polygon',
          coordinates: circle.geometry.coordinates,
        },
      });

      // newFeature generates an id for the feature automatically; track it:
      state.inProgressCircleId = String(circleFeature.id);
      this.addFeature(circleFeature);
    } else {
      // update existing circle feature if it does exist
      circleFeature.setCoordinates(circle.geometry.coordinates as any);
    }
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
  return circle(circleCenterPoint, distanceFromCenterToEdgeInKm, { steps: 20 });
};
