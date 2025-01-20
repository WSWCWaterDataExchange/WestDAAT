import MapboxDraw, { DrawCustomMode } from '@mapbox/mapbox-gl-draw';
import center from '@turf/center';
import { LngLat } from 'mapbox-gl';
import { Feature, GeoJSON, GeoJsonProperties, Geometry, Position } from 'geojson';
import { generateCircleWithRadiusFromCenterPointToEdgePoint } from '../../utilities/geometryHelpers';

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

// DrawCustomMode type definition doesn't allow for extending the type with additional properties
// although the js implementation of `direct_select` does exactly that
export const CustomDirectSelectMode: DrawCustomMode = {
  ...baseMode,

  onSetup: function (opts): CircleSelectModeState {
    const state: CircleSelectModeState = baseMode.onSetup?.call(this, opts);
    state.customState = defaultCustomState;

    if (state.feature?.properties?.isCircle) {
      state.customState.circleState.circleCenterPointLngLat = center(state.feature).geometry.coordinates as [
        number,
        number,
      ];
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
      }
    };

    const dragVertex = (e: MapboxDraw.MapMouseEvent) => {
      // determine whether to override the drag behavior
      if (state.feature?.properties?.isCircle) {
        // find new coordinate location via mouse position
        const newCoordPosition = e.lngLat;

        // generate new coordinates
        const newCoordinates = generateCircleWithRadiusFromCenterPointToEdgePoint(
          state.customState.circleState.circleCenterPointLngLat!,
          newCoordPosition.toArray(),
        );

        // update the feature with the new coordinates
        state.feature?.setCoordinates(newCoordinates.geometry.coordinates);
      } else {
        baseMode.onDrag?.call(this, state, e);
      }
    };

    // determine whether to move the whole feature or just a vertex
    if (state.selectedCoordPaths.length > 0) {
      dragVertex(e);
    } else {
      dragFeature();
    }

    // post-processing copied from base implementation
    state.dragMoveLocation = e.lngLat;
  },

  toDisplayFeatures: function (
    state: CircleSelectModeState,
    geojson: Feature<Geometry, GeoJsonProperties>,
    display: (geojson: GeoJSON) => void,
  ) {
    const getRightmostCoordinate = (): Position => {
      return state
        .feature!.getCoordinates()
        .map((position) => position[1])
        .reduce((prevLng, currentLng) => (prevLng > currentLng ? prevLng : currentLng));
    };

    // determine whether to override the base implementation
    if (state.feature?.properties?.isCircle) {
      // display the circle feature
      if (state.featureId === geojson.properties?.id) {
        geojson.properties.active = 'true';
        display(geojson);

        const supplementaryPointLocation = getRightmostCoordinate();

        // render the supplementary point manually so it doesn't become part of the map's feature collection
        const vertex: Feature<Geometry, GeoJsonProperties> = {
          type: 'Feature',
          properties: {
            meta: 'vertex',
            parent: geojson.properties.id,
            coord_path: '0.0',
            active: 'true',
          },
          geometry: {
            type: 'Point',
            coordinates: [supplementaryPointLocation[0], supplementaryPointLocation[1]],
          },
        };
        display(vertex);
      }
    } else {
      // call base implementation
      baseMode.toDisplayFeatures?.call(this, state, geojson, display);
    }
  },
};
