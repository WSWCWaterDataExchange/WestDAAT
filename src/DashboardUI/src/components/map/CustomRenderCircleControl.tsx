import { mdiCircle } from '@mdi/js';
import { CustomMapControl } from './CustomMapControl';
import { circle } from '@turf/turf';
import { Feature, GeoJsonProperties, Polygon } from 'geojson';
import { CustomLayerInterface, LayerSpecification, Map as MapInstance, MapMouseEvent } from 'mapbox-gl';

const circleLayerId: string = 'circle-layer';
const circleSource: string = 'circle-source';

export class CustomRenderCircleControl extends CustomMapControl {
  private _mapInstance!: MapInstance;
  private _toolIsActive: boolean = false;

  constructor(mapInstance: MapInstance) {
    super(mdiCircle, 'render a circle', () => {
      this.toggleToolActive();

      this._mapInstance = mapInstance;
      this.handleToolClicked();
    });
  }

  getCircleLayer = (): LayerSpecification | CustomLayerInterface | undefined => {
    return this._mapInstance.getLayer(circleLayerId);
  };

  handleToolClicked = (): void => {
    if (this._toolIsActive) {
      console.log('register map click handler');
      this._mapInstance.on('click', this.handleMapClick);
    } else {
      this._mapInstance.off('click', this.handleMapClick);
    }
  };

  handleMapClick = (e: MapMouseEvent) => {
    console.log('map clicked', e);
    const point = [e.lngLat.lng, e.lngLat.lat];

    const generatedCircle = this.generateCircleAtPoint(point, 100);
    this.renderGeoJsonPolygonToMap(this._mapInstance, generatedCircle);
  };

  toggleToolActive = (): void => {
    this._toolIsActive = !this._toolIsActive;
    console.log('active toggled:', this._toolIsActive);
  };

  generateCircleAtPoint(point: number[], radius: number): Feature<Polygon, GeoJsonProperties> {
    return circle(point, radius, { steps: 100 });
  }

  resetSourceAndLayer = (): void => {
    if (this._mapInstance.getLayer(circleLayerId)) {
      this._mapInstance.removeLayer(circleLayerId);
    }
    if (this._mapInstance.getSource(circleSource)) {
      this._mapInstance.removeSource(circleSource);
    }
  };

  renderGeoJsonPolygonToMap = (mapInstance: MapInstance, polygon: Feature<Polygon, GeoJsonProperties>) => {
    this.resetSourceAndLayer();
    mapInstance.addSource(circleSource, {
      type: 'geojson',
      data: polygon,
    });

    this._mapInstance.addLayer({
      id: circleLayerId,
      type: 'fill',
      source: circleSource,
      paint: {
        'fill-color': 'orange',
        'fill-opacity': 0.5,
      },
    });
  };
}
