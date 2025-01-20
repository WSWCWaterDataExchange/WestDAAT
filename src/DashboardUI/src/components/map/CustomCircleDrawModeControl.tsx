import { mdiCircle } from '@mdi/js';
import { CustomMapControl } from './CustomMapControl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';

export class CustomCircleDrawModeControl extends CustomMapControl {
  constructor(mapboxDraw: MapboxDraw | null) {
    super(mdiCircle, 'circle draw tool', () => {
      mapboxDraw?.changeMode('draw_circle');
    });
  }
}
