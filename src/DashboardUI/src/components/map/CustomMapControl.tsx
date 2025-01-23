export class CustomMapControl {
  private _icon: string;
  private _text: string;
  private _onClick: () => void;

  constructor(icon: string, text: string, onClick: () => void) {
    this._icon = icon;
    this._text = text;
    this._onClick = onClick;
  }

  onAdd() {
    const xmlns = 'http://www.w3.org/2000/svg';
    const path = document.createElementNS(xmlns, 'path');
    path.setAttributeNS(null, 'd', this._icon);
    path.setAttributeNS(null, 'style', 'fill: #000000');

    const svg = document.createElementNS(xmlns, 'svg');
    svg.setAttributeNS(null, 'viewbox', '0 0 24 24');
    svg.setAttributeNS(null, 'style', 'width: 25px; height: 25px;');
    svg.appendChild(path);

    const btn = document.createElement('button');
    btn.className = 'mapbox-gl-draw_ctrl-draw-btn';
    btn.title = this._text;

    btn.onclick = this._onClick;

    btn.appendChild(svg);

    const container = document.createElement('div');
    container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group containerElement';
    container.appendChild(btn);

    return container;
  }

  onRemove() {
    return;
  }
}
