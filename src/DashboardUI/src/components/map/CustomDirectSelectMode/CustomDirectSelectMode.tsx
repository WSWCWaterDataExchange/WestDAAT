import MapboxDraw, { DrawCustomMode, DrawCustomModeThis } from '@mapbox/mapbox-gl-draw';
import center from '@turf/center';
import { LngLat } from 'mapbox-gl';
import { Feature, GeoJSON, GeoJsonProperties, Geometry, Point } from 'geojson';
import { dragFeature, dragVertex } from './CustomDirectSelectModeDragHelpers';
import { handleDisplayCircle, handleDisplayRectangle } from './CustomDirectSelectModeDisplayHelpers';

// base code used for reference: https://github.com/mapbox/mapbox-gl-draw/blob/main/src/modes/direct_select.js

export const directSelectBaseMode = MapboxDraw.modes.direct_select;

export interface CustomDirectSelectModeState {
  customState: {
    isCircle: boolean;
    circleState: {
      circleCenterPointLngLat: [number, number] | undefined;
    };
    isRectangle: boolean;
    rectangleState: {
      cornerFeatures: MapboxDraw.DrawPoint[];
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

const defaultCustomState: CustomDirectSelectModeState['customState'] = {
  isCircle: false,
  circleState: {
    circleCenterPointLngLat: undefined,
  },
  isRectangle: false,
  rectangleState: {
    cornerFeatures: [],
  },
};

export type DirectSelectDrawModeInstance = DrawCustomMode & DrawCustomModeThis;

// DrawCustomMode type definition doesn't allow for extending the type with additional properties
// although the js implementation of `direct_select` does exactly that
export const CustomDirectSelectMode: DrawCustomMode = {
  ...directSelectBaseMode,

  // when a polygon is clicked on, this method is called to initialize the state
  onSetup: function (opts): CustomDirectSelectModeState {
    const state: CustomDirectSelectModeState = directSelectBaseMode.onSetup?.call(this, opts);
    state.customState = defaultCustomState;

    if (state.feature?.properties?.isCircle) {
      state.customState.circleState.circleCenterPointLngLat = center(state.feature).geometry.coordinates as [
        number,
        number,
      ];
    } else if (state.feature?.properties?.isRectangle) {
      // get rectangle's child corner coordinate features
      const sources = this.map.getStyle()!.sources;
      const rectangleCornerFeatures = Object.keys(sources)
        .map((sourceKey) => sources[sourceKey])
        .filter((source) => source.type === 'geojson')
        .map((geoJsonSource) => geoJsonSource.data)
        .filter(
          (geoJsonSourceData): geoJsonSourceData is GeoJSON<Geometry, GeoJsonProperties> =>
            typeof geoJsonSourceData === 'object',
        )
        .filter((geoJsonSourceData) => geoJsonSourceData.type === 'FeatureCollection')
        .flatMap((geoJsonSourceData) => geoJsonSourceData.features)
        // the rectangle's child corner features are all Point geometries
        // find the relevant points corresponding to this rectangle
        .filter(
          (feature): feature is Feature<Point, GeoJsonProperties> => feature.properties?.parent === state.feature?.id,
        );

      // the corner features exist in the map's source, but this draw mode isn't aware of them and thus cannot render markers over them.
      // register the corner features in the draw mode (if they haven't been already) and add to state so they can be rendered.
      const rectangleCornerDrawFeatures = rectangleCornerFeatures.map(
        (feature) => (this.getFeature(String(feature.id)) ?? this.newFeature(feature)) as MapboxDraw.DrawPoint,
      );

      state.customState.rectangleState = {
        cornerFeatures: rectangleCornerDrawFeatures,
      };
    }

    return state;
  },

  onDrag: function (state: CustomDirectSelectModeState, e: MapboxDraw.MapMouseEvent) {
    // validation copied from base implementation
    if (state.canDragMove !== true) return;
    state.dragMoving = true;
    e.originalEvent.stopPropagation();

    // determine whether to move the whole feature or just a vertex
    if (state.selectedCoordPaths.length > 0) {
      dragVertex(this, state, e);
    } else {
      dragFeature(this, state, e);
    }

    // post-processing copied from base implementation
    state.dragMoveLocation = e.lngLat;
  },

  toDisplayFeatures: function (
    state: CustomDirectSelectModeState,
    geojson: Feature<Geometry, GeoJsonProperties>,
    display: (geojson: GeoJSON) => void,
  ) {
    // determine whether to override the base implementation
    if (state.feature?.properties?.isCircle && state.featureId === geojson.properties?.id) {
      handleDisplayCircle(state, geojson, display);
    } else if (state.feature?.properties?.isRectangle && state.featureId === geojson.properties?.id) {
      handleDisplayRectangle(this, state, geojson, display);
    } else {
      // call base implementation
      directSelectBaseMode.toDisplayFeatures?.call(this, state, geojson, display);
    }
  },
};
