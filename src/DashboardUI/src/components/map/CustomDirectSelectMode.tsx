import MapboxDraw, { DrawCustomMode } from '@mapbox/mapbox-gl-draw';
import center from '@turf/center';
import circle from '@turf/circle';
import distance from '@turf/distance';
import { Feature, GeoJsonProperties, Polygon } from 'geojson';
import { LngLat } from 'mapbox-gl';

// base code used for reference: https://github.com/mapbox/mapbox-gl-draw/blob/main/src/modes/direct_select.js

const baseMode = MapboxDraw.modes.direct_select;

interface CircleSelectModeState {
  customState: {
    isCircle: boolean;
    circleState: {
      circleCenterPointLngLat: [number, number] | undefined;
    };
  };
  // inherited properties from base implementation
  canDragMove: boolean;
  dragMoveLocation: LngLat;
  dragMoving: boolean;
  featureId: string;
  feature: MapboxDraw.DrawPolygon | null | undefined; //?
  selectedCoordPaths: string[];
}

const defaultCustomState: CircleSelectModeState['customState'] = {
  isCircle: false,
  circleState: {
    circleCenterPointLngLat: undefined,
  },
};

type CircleFeature = Feature<Polygon, GeoJsonProperties>;

// DrawCustomMode type definition doesn't allow for extending the type with additional properties
// although the js implementation of `direct_select` does exactly that
export const CustomDirectSelectMode: DrawCustomMode = {
  ...baseMode,

  onSetup: function (opts): CircleSelectModeState {
    // initialize state
    const state: CircleSelectModeState = baseMode.onSetup?.call(this, opts);
    state.customState = defaultCustomState;

    if (state.feature?.properties?.isCircle) {
      state.customState.circleState.circleCenterPointLngLat = center(state.feature).geometry.coordinates as [
        number,
        number,
      ];
      console.log('center point', state.customState.circleState.circleCenterPointLngLat);
    }

    return state;
  },

  onDrag: function (state: CircleSelectModeState, e: MapboxDraw.MapMouseEvent) {
    // validation copied from base implementation
    if (state.canDragMove !== true) return;
    state.dragMoving = true;
    e.originalEvent.stopPropagation();

    const dragFeature = () => {
      // call base implementation, let it handle the drag
      baseMode.onDrag?.call(this, state, e);

      if (state.feature?.properties?.isCircle) {
        // afterwards update the center point of the circle
        state.customState.circleState.circleCenterPointLngLat = center(state.feature).geometry.coordinates as [
          number,
          number,
        ];
        console.log('center point updated', state.customState.circleState.circleCenterPointLngLat);
      }
    };

    const dragVertex2 = (e: MapboxDraw.MapMouseEvent) => {
      // find new coordinate location via mouse position
      const newCoordPosition = e.lngLat;

      // generate new coordinates
      const newCoordinates = generateCircleWithRadiusFromCenterPointToEdgePoint(
        state.customState.circleState.circleCenterPointLngLat!,
        newCoordPosition.toArray(),
      );

      // update the feature with the new coordinates
      state.feature?.setCoordinates(newCoordinates.geometry.coordinates);
    };

    // determine whether to call base implementation or custom implementation
    if (state.selectedCoordPaths.length > 0) {
      dragVertex2(e);
    } else {
      dragFeature();
    }

    // post-processing copied from base implementation
    state.dragMoveLocation = e.lngLat;
  },
};

const generateCircleWithRadiusFromCenterPointToEdgePoint = (
  circleCenterPoint: number[],
  circleEdgePoint: number[],
): CircleFeature => {
  const distanceFromCenterToEdgeInKm = distance(circleCenterPoint, circleEdgePoint, {
    units: 'kilometers',
  });
  console.log('update circle with radius', distanceFromCenterToEdgeInKm);
  return circle(circleCenterPoint, distanceFromCenterToEdgeInKm, { steps: 20 });
};
