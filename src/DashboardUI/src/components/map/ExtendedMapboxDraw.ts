import { Map } from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';

/*
 * code sourced from here: https://github.com/mapbox/mapbox-gl-draw/issues/874#issuecomment-2031731131
 * relevant stackblitz: https://stackblitz.com/edit/vitejs-vite-bvutvb?file=src%2Fmain.tsx,src%2FApp.tsx,src%2FDraw.tsx
 */

export type DrawBarButton = {
  on: keyof HTMLElementEventMap;
  title: string;
  action: () => void;
  classes?: string[];
  content: HTMLElement;
};

export type ConstructorProps = {
  props: ConstructorParameters<typeof MapboxDraw>[0];
  buttons?: DrawBarButton[];
};

/**
 * This class extends the MapboxDraw to add custom functionalities like custom buttons
 * to the Draw Bar.
 */
export class ExtendedMapboxDraw extends MapboxDraw {
  private _newButtons: DrawBarButton[];
  private _container?: HTMLElement;
  parentOnAdd: (map: Map) => HTMLElement;

  constructor({ buttons, props }: ConstructorProps) {
    super(props);
    this._newButtons = buttons || [];
    this.parentOnAdd = this.onAdd;
    // @ts-expect-error the only way to override this method from MapboxDraw. We have to delete and re-add it below
    delete this.onAdd;
  }

  onAdd(map: Map) {
    // the default buttons
    this._container = this.parentOnAdd(map);
    // adding each new button to Draw Bar
    this._newButtons.forEach((button) => {
      const elButton = document.createElement('button');
      elButton.className = 'mapbox-gl-draw_ctrl-draw-btn';
      elButton.title = button.title;
      if (button.classes) {
        button.classes.forEach((buttonClass) => {
          elButton.classList.add(buttonClass);
        });
      }
      elButton.appendChild(button.content);
      elButton.addEventListener(button.on, button.action);

      this._container?.prepend(elButton, this._container.firstChild!);
    });
    return this._container;
  }
}
