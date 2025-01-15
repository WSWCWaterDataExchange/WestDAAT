import { mdiCircle } from '@mdi/js';
import { CustomMapControl } from './CustomMapControl';
import { circle, distance } from '@turf/turf';
import { Feature, GeoJsonProperties, Polygon } from 'geojson';
import {
  CustomLayerInterface,
  LayerSpecification,
  MapEvent,
  Map as MapInstance,
  MapMouseEvent,
  MapTouchEvent,
} from 'mapbox-gl';

const circleLayerId: string = 'circle-layer';
const circleSource: string = 'circle-source';

export class CustomRenderCircleControl extends CustomMapControl {
  private _mapInstance!: MapInstance;
  private _toolIsActive: boolean = false;

  private _circleCenterPoint: number[] | undefined;

  constructor(mapInstance: MapInstance) {
    super(mdiCircle, 'tooltip - render a circle', () => {
      this.toggleToolActive();

      this._mapInstance = mapInstance;
      this.handleToolClicked();
    });
  }

  getCircleLayer = (): LayerSpecification | CustomLayerInterface | undefined => {
    return this._mapInstance.getLayer(circleLayerId);
  };

  registerClickHandlers = (): void => {
    console.log('register click handlers');
    // this._mapInstance.on('click', this.handleMapClick);
    this._mapInstance.on('touchstart', (e) => {
      this.handleTouchStart(e);
    });

    this._mapInstance.on('touchmove', (e) => {
      this.handleTouchMove(e);
    });
  };

  deRegisterClickHandler = (): void => {
    // this._mapInstance.off('click', this.handleMapClick);
  };

  handleToolClicked = (): void => {
    if (this._toolIsActive) {
      this.registerClickHandlers();
    } else {
      this.deRegisterClickHandler();
      this.resetSourceAndLayer();
    }
  };

  handleTouchStart = (e: MapTouchEvent) => {
    this._circleCenterPoint = [e.lngLat.lng, e.lngLat.lat];
    console.log('touch start, set center', this._circleCenterPoint);
  };

  handleTouchMove = (e: MapTouchEvent) => {
    const currentLocation = [e.lngLat.lng, e.lngLat.lat];
    const distanceFromCircleCenterToMouseInKm = distance(this._circleCenterPoint!, currentLocation, {
      units: 'kilometers',
    });
    console.log('touch move, distance:', distanceFromCircleCenterToMouseInKm);
    const circleFeature = this.generateCircleAtPoint(this._circleCenterPoint!, distanceFromCircleCenterToMouseInKm);
    this.renderGeoJsonPolygonToMap(this._mapInstance, circleFeature);
  };

  toggleToolActive = (): void => {
    this._toolIsActive = !this._toolIsActive;
  };

  generateCircleAtPoint(point: number[], radiusInKm: number): Feature<Polygon, GeoJsonProperties> {
    return circle(point, radiusInKm, { steps: 100 });
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
