import { mdiCircle } from '@mdi/js';
import { CustomMapControl } from './CustomMapControl';
import { circle, distance } from '@turf/turf';
import { Feature, GeoJsonProperties, Polygon } from 'geojson';
import { GeoJSONSource, Map as MapInstance, MapMouseEvent } from 'mapbox-gl';

const circlesLayerId: string = 'circle-layer';
const circlesSource: string = 'circle-source';

const inProgressCircleLayerId: string = 'in-progress-circle-layer';
const inProgressCircleSource: string = 'in-progress-circle-source';

type Circle = Feature<Polygon, GeoJsonProperties>;

export class CustomRenderCircleControl extends CustomMapControl {
  private _mapInstance!: MapInstance;
  private _toolIsActive: boolean = false;

  private _circleFeatures: Circle[] = [];
  private _inProgressCircleCenterPoint: number[] | undefined;

  constructor(mapInstance: MapInstance) {
    super(mdiCircle, `circle tool`, () => {
      this.toggleToolActive();

      this._mapInstance = mapInstance;

      this.resetSourcesAndLayers();
      this.initializeSourcesAndLayers();

      this.toggleMapEventListeners();
    });
  }

  registerClickHandlers = (): void => {
    this._mapInstance.on('click', this.handleMouseClick);
    this._mapInstance.on('mousemove', this.handleMouseMove);
  };

  deRegisterClickHandler = (): void => {
    this._mapInstance.off('click', this.handleMouseClick);
    this._mapInstance.off('mousemove', this.handleMouseMove);
  };

  toggleMapEventListeners = (): void => {
    if (this._toolIsActive) {
      this.registerClickHandlers();
    } else {
      this.deRegisterClickHandler();
      this.resetSourcesAndLayers();
      this.resetControlState();
    }
  };

  handleMouseClick = (e: MapMouseEvent) => {
    const coords = [e.lngLat.lng, e.lngLat.lat];
    if (!this._inProgressCircleCenterPoint) {
      this._inProgressCircleCenterPoint = coords;
    } else {
      const circleFeature = this.generateCircleWithRadiusFromCenterPointToEdgePoint(
        this._inProgressCircleCenterPoint,
        coords,
      );
      this._circleFeatures.push(circleFeature);
      this._inProgressCircleCenterPoint = undefined;
      this.renderFinishedCirclesToMap();
    }
  };

  handleMouseMove = (e: MapMouseEvent) => {
    // render the potential circle only while the first coord is set
    if (!this._inProgressCircleCenterPoint) {
      return;
    }
    const coords = [e.lngLat.lng, e.lngLat.lat];
    this.renderInProgressCircle(coords);
  };

  generateCircleWithRadiusFromCenterPointToEdgePoint = (
    circleCenterPoint: number[],
    circleEdgePoint: number[],
  ): Circle => {
    const distanceFromCircleCenterToMouseInKm = distance(circleCenterPoint, circleEdgePoint, {
      units: 'kilometers',
    });
    return this.generateCircleAtPoint(circleCenterPoint, distanceFromCircleCenterToMouseInKm);
  };

  toggleToolActive = (): void => {
    this._toolIsActive = !this._toolIsActive;
  };

  generateCircleAtPoint(point: number[], radiusInKm: number): Circle {
    return circle(point, radiusInKm, { steps: 100 });
  }

  initializeSourcesAndLayers = (): void => {
    this._mapInstance.addSource(circlesSource, {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    });

    this._mapInstance.addLayer({
      id: circlesLayerId,
      type: 'fill',
      source: circlesSource,
      paint: {
        'fill-color': 'orange',
        'fill-opacity': 0.5,
      },
    });

    this._mapInstance.addSource(inProgressCircleSource, {
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
      id: inProgressCircleLayerId,
      type: 'fill',
      source: inProgressCircleSource,
      paint: {
        'fill-color': 'orange',
        'fill-opacity': 0.5,
      },
    });
  };

  resetSourcesAndLayers = (): void => {
    if (this._mapInstance.getLayer(circlesLayerId)) {
      this._mapInstance.removeLayer(circlesLayerId);
    }
    if (this._mapInstance.getSource(circlesSource)) {
      this._mapInstance.removeSource(circlesSource);
    }

    if (this._mapInstance.getLayer(inProgressCircleLayerId)) {
      this._mapInstance.removeLayer(inProgressCircleLayerId);
    }
    if (this._mapInstance.getSource(inProgressCircleSource)) {
      this._mapInstance.removeSource(inProgressCircleSource);
    }
  };

  resetControlState = (): void => {
    this._inProgressCircleCenterPoint = undefined;
    this._circleFeatures = [];
  };

  renderFinishedCirclesToMap = () => {
    const source: GeoJSONSource = this._mapInstance.getSource(circlesSource)!;
    source.setData({
      type: 'FeatureCollection',
      features: this._circleFeatures,
    });
  };

  renderInProgressCircle = (circleEdgePoint: number[]) => {
    const circle = this.generateCircleWithRadiusFromCenterPointToEdgePoint(
      this._inProgressCircleCenterPoint!,
      circleEdgePoint,
    );
    const source: GeoJSONSource = this._mapInstance.getSource(inProgressCircleSource)!;
    source.setData({
      type: 'Feature',
      properties: {},
      geometry: circle.geometry,
    });
  };
}
