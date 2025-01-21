import { mdiVectorCircle } from '@mdi/js';
import { CustomMapControl } from './CustomMapControl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';

export class CustomCircleDrawModeControl extends CustomMapControl {
  constructor(mapboxDraw: MapboxDraw | null) {
    super(mdiVectorCircle, 'circle draw tool', () => {
      mapboxDraw?.changeMode('draw_circle');
    });
  }
}
