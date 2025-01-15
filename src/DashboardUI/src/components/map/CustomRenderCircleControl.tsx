import { mdiCircle } from '@mdi/js';
import { CustomMapControl } from './CustomMapControl';
import { circle, distance } from '@turf/turf';
import { Feature, GeoJsonProperties, Polygon } from 'geojson';
import { CustomLayerInterface, LayerSpecification, MapEvent, Map as MapInstance, MapMouseEvent } from 'mapbox-gl';

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
    this._mapInstance.on('dragstart', (e) => {
      console.log('touchstart:', e);
      this.handleTouchStart(e);
    });

    this._mapInstance.on('drag', (e) => {
      console.log('touchmove:', e);
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

  // handleMapClick = (e: MapMouseEvent) => {
  //   console.log('clicked map');
  //   this._circleCenterPoint = [e.lngLat.lng, e.lngLat.lat];
  // };

  handleTouchStart = (e: MapEvent) => {
    const center = e.target.getCenter();
    this._circleCenterPoint = [center.lng, center.lat];
  };

  handleTouchMove = (e: MapEvent) => {
    const center = e.target.getCenter();
    const currentLocation = [center.lng, center.lat];
    const distanceFromCircleCenterToMouseInKm = distance(this._circleCenterPoint!, currentLocation, {
      units: 'kilometers',
    });
    const circleFeature = this.generateCircleAtPoint(this._circleCenterPoint!, distanceFromCircleCenterToMouseInKm);
    this.renderGeoJsonPolygonToMap(this._mapInstance, circleFeature);
  };

  handleMapDrag = (e: MapEvent) => {
    if (!this._circleCenterPoint) {
      return;
    }
    console.log('dragged map');

    const mouseLocationLngLat = e.target.getCenter();
    const mouseLocation = [mouseLocationLngLat.lng, mouseLocationLngLat.lat];
    const distanceFromCircleCenterToMouseInKm = distance(this._circleCenterPoint, mouseLocation, {
      units: 'kilometers',
    });
    const circleFeature = this.generateCircleAtPoint(this._circleCenterPoint, distanceFromCircleCenterToMouseInKm);
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
