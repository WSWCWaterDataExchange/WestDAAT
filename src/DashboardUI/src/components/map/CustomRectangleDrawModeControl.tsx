import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { CustomMapControl } from './CustomMapControl';
import { mdiVectorRectangle } from '@mdi/js';

export class CustomRectangleDrawModeControl extends CustomMapControl {
  constructor(mapboxDraw: MapboxDraw | null) {
    super(mdiVectorRectangle, 'Rectangle tool', () => {
      mapboxDraw?.changeMode('draw_rectangle');
    });
  }
}
