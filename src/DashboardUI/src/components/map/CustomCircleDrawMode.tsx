import MapboxDraw, { DrawCustomMode, MapMouseEvent } from '@mapbox/mapbox-gl-draw';
import { GeoJSON } from 'geojson';
import { generateCircleWithRadiusFromCenterPointToEdgePoint } from '../../utilities/geometryHelpers';

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

      const defaultMapMode = 'simple_select';
      this.changeMode(defaultMapMode);
    }
  },

  onMouseMove: function (state: CircleDrawModeState, e: MapMouseEvent) {
    const coords = e.lngLat.toArray();
    const circleHasBeenStarted = state.inProgressCircleCenterPoint !== undefined;

    if (!circleHasBeenStarted) {
      return;
    }

    // render the in-progress circle:
    // generate the new geometry
    const circle = generateCircleWithRadiusFromCenterPointToEdgePoint(state.inProgressCircleCenterPoint!, coords);

    let circleFeature: MapboxDraw.DrawPolygon = this.getFeature(
      state.inProgressCircleId ?? '',
    ) as MapboxDraw.DrawPolygon;

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
      }) as MapboxDraw.DrawPolygon;

      // newFeature generates an id for the feature automatically; track it:
      state.inProgressCircleId = String(circleFeature.id);

      // add the circle to the map
      this.addFeature(circleFeature);
    } else {
      // update existing circle feature if it does exist
      circleFeature.setCoordinates(circle.geometry.coordinates);
    }
  },

  onStop: function (state: CircleDrawModeState) {
    // no cleanup needed. we do want to leave this method in place to prevent the default behavior though
  },

  toDisplayFeatures: function (state, geojson: GeoJSON, display: (feature: GeoJSON) => void) {
    // render the circle
    display(geojson);
  },
};
