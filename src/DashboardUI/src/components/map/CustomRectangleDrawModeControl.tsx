import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { CustomMapControl } from './CustomMapControl';
import { mdiRectangleOutline } from '@mdi/js';

export class CustomRectangleDrawModeControl extends CustomMapControl {
  constructor(mapboxDraw: MapboxDraw | null) {
    super(mdiRectangleOutline, 'rectangle draw tool', () => {
      mapboxDraw?.changeMode('draw_rectangle');
    });
  }
}
