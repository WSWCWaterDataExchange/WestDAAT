import { mdiCircle } from '@mdi/js';
import { CustomMapControl } from './CustomMapControl';
import { circle, distance } from '@turf/turf';
import { Feature, GeoJsonProperties, Polygon } from 'geojson';
import { CustomLayerInterface, GeoJSONSource, LayerSpecification, Map as MapInstance, MapMouseEvent } from 'mapbox-gl';

const circleLayerId: string = 'circle-layer';
const circleSource: string = 'circle-source';

export class CustomRenderCircleControl extends CustomMapControl {
  private _mapInstance!: MapInstance;
  private _toolIsActive: boolean = false;

  private _circleCenterPoint: number[] | undefined;
  private _circleEdgePoint: number[] | undefined;

  constructor(mapInstance: MapInstance) {
    super(mdiCircle, `circle tool`, () => {
      this.toggleToolActive();

      this._mapInstance = mapInstance;

      this.resetSourceAndLayer();
      this.initializeSourceAndLayer();

      this.handleToolClicked();
    });
  }

  getCircleLayer = (): LayerSpecification | CustomLayerInterface | undefined => {
    return this._mapInstance.getLayer(circleLayerId);
  };

  registerClickHandlers = (): void => {
    this._mapInstance.on('click', this.handleMouseClick);
    this._mapInstance.on('mousemove', this.handleMouseMove);
  };

  deRegisterClickHandler = (): void => {
    this._mapInstance.off('click', this.handleMouseClick);
    this._mapInstance.off('mousemove', this.handleMouseMove);
  };

  handleToolClicked = (): void => {
    if (this._toolIsActive) {
      this.registerClickHandlers();
    } else {
      this.deRegisterClickHandler();
      this.resetSourceAndLayer();
      this.resetControlState();
    }
  };

  handleMouseClick = (e: MapMouseEvent) => {
    const coords = [e.lngLat.lng, e.lngLat.lat];
    if (!this._circleCenterPoint) {
      this._circleCenterPoint = coords;
      console.log('click 1, set center', this._circleCenterPoint);
    } else {
      this._circleEdgePoint = coords;
      console.log('click 2, set edge', this._circleEdgePoint);

      this.renderCircle(this._circleCenterPoint!, this._circleEdgePoint!);
    }
  };

  handleMouseMove = (e: MapMouseEvent) => {
    // render the potential circle only while the first coord is set and the second coord is not set
    if (!this._circleCenterPoint || this._circleEdgePoint) {
      return;
    }
    const coords = [e.lngLat.lng, e.lngLat.lat];
    this.renderCircle(this._circleCenterPoint, coords);
  };

  renderCircle = (circleCenterPoint: number[], circleEdgePoint: number[]) => {
    const distanceFromCircleCenterToMouseInKm = distance(circleCenterPoint, circleEdgePoint, {
      units: 'kilometers',
    });
    const circleFeature = this.generateCircleAtPoint(circleCenterPoint, distanceFromCircleCenterToMouseInKm);
    this.renderGeoJsonPolygonToMap(this._mapInstance, circleFeature);
  };

  toggleToolActive = (): void => {
    this._toolIsActive = !this._toolIsActive;
  };

  generateCircleAtPoint(point: number[], radiusInKm: number): Feature<Polygon, GeoJsonProperties> {
    return circle(point, radiusInKm, { steps: 100 });
  }

  initializeSourceAndLayer = (): void => {
    this._mapInstance.addSource(circleSource, {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: [],
        },
      },
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

  resetSourceAndLayer = (): void => {
    if (this._mapInstance.getLayer(circleLayerId)) {
      this._mapInstance.removeLayer(circleLayerId);
    }
    if (this._mapInstance.getSource(circleSource)) {
      this._mapInstance.removeSource(circleSource);
    }
  };

  resetControlState = (): void => {
    this._circleCenterPoint = undefined;
    this._circleEdgePoint = undefined;
  };

  renderGeoJsonPolygonToMap = (mapInstance: MapInstance, polygon: Feature<Polygon, GeoJsonProperties>) => {
    const source: GeoJSONSource = mapInstance.getSource(circleSource)!;
    source.setData(polygon);
  };
}
