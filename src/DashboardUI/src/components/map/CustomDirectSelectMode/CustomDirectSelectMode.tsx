import MapboxDraw, { DrawCustomMode, DrawCustomModeThis } from '@mapbox/mapbox-gl-draw';
import center from '@turf/center';
import { LngLat, Marker } from 'mapbox-gl';
import { Feature, GeoJSON, GeoJsonProperties, Geometry, Point, Position } from 'geojson';
import { dragFeature, dragVertex } from './CustomDirectSelectModeDragHelpers';
import { handleDisplayCircle, handleDisplayRectangle } from './CustomDirectSelectModeDisplayHelpers';
import { distance } from '@turf/distance';
import { bearing } from '@turf/bearing';
import { destination } from '@turf/destination';

// base code used for reference: https://github.com/mapbox/mapbox-gl-draw/blob/main/src/modes/direct_select.js

export const directSelectBaseMode = MapboxDraw.modes.direct_select;

export interface CustomDirectSelectModeState {
  customState: {
    circleState: {
      circleCenterPointLngLat: [number, number] | undefined;
    };
    rectangleState: {
      cornerFeatures: MapboxDraw.DrawPoint[];
      rotationMarkers: Marker[];
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
  circleState: {
    circleCenterPointLngLat: undefined,
  },
  rectangleState: {
    cornerFeatures: [],
    rotationMarkers: [],
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
      // get rectangle's child corner Point features
      // they aren't available directly as part of the polygon so we have to grab them in a roundabout way
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

      // register the corner features in this draw mode and track them in state
      const rectangleCornerDrawFeatures = rectangleCornerFeatures.map((feature) => {
        const drawnFeature = this.newFeature(feature) as MapboxDraw.DrawPoint;
        drawnFeature.setProperty('isCorner', true);
        return drawnFeature;
      });
      console.log('corner features', rectangleCornerDrawFeatures);

      // create the rotation features as well and track them
      // 1. find the midpoints of the rectangle's edges
      const rectangleCoordinates = state.feature.getCoordinates()[0];
      const rectangleEdgeMidpoints: Position[] = [
        [rectangleCoordinates[0], rectangleCoordinates[1]],
        [rectangleCoordinates[1], rectangleCoordinates[2]],
        [rectangleCoordinates[2], rectangleCoordinates[3]],
        [rectangleCoordinates[3], rectangleCoordinates[0]],
      ].map(([start, end]) => {
        const midpoint = [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2];
        return midpoint;
      });

      // 2. determine the position of the rotation markers
      // add small gap so the rotation markers aren't right on the edge of the rectangle
      const rectangleCenter = center(state.feature).geometry.coordinates as [number, number];
      const rotationMarkerPositions: Position[] = rectangleEdgeMidpoints.map((midpoint) => {
        const distanceFromCenterToMidpoint = distance(rectangleCenter, midpoint, { units: 'kilometers' });
        const bearingFromCenterToMidpoint = bearing(rectangleCenter, midpoint);
        return destination(rectangleCenter, distanceFromCenterToMidpoint * 1.25, bearingFromCenterToMidpoint).geometry
          .coordinates;
      });

      // 3. create marker features and track in state
      const rotationMarkers = rotationMarkerPositions.map((position) => {
        return new Marker({
          color: 'red',
        })
          .setLngLat({ lng: position[0], lat: position[1] })
          .addTo(this.map);
      });

      state.customState.rectangleState = {
        cornerFeatures: rectangleCornerDrawFeatures,
        rotationMarkers: rotationMarkers,
      };
      console.log(state.feature, state.customState.rectangleState);
    }

    return state;
  },

  onStop: function (state: CustomDirectSelectModeState) {
    directSelectBaseMode.onStop?.call(this, state);

    if (state.feature?.properties?.isRectangle) {
      console.log('remove rotation markers', state.customState.rectangleState.rotationMarkers);
      state.customState.rectangleState.rotationMarkers.forEach((marker) => marker.remove());
    }
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
