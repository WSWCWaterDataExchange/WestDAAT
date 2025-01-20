import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { DrawCustomMode } from '@mapbox/mapbox-gl-draw';
import { GeoJSON } from 'geojson';

export const CustomCircleSelectMode: DrawCustomMode = {
  ...MapboxDraw.modes.direct_select,
};
