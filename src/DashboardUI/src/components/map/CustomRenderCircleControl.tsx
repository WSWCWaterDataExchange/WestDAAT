import { mdiCircle } from '@mdi/js';
import { CustomMapControl } from './CustomMapControl';
import { center, circle, distance } from '@turf/turf';
import { Feature, GeoJsonProperties, Polygon } from 'geojson';
import { GeoJSONSource, Map as MapInstance, MapMouseEvent } from 'mapbox-gl';

const circlesLayerId: string = 'circle-layer';
const circlesSource: string = 'circle-source';

const inProgressCircleLayerId: string = 'in-progress-circle-layer';
const inProgressCircleSource: string = 'in-progress-circle-source';

const circleHandlesLayerId: string = 'circle-handles-layer';
const circleHandlesSource: string = 'circle-handles-source';

type CircleFeature = Feature<Polygon, GeoJsonProperties>;

interface CircleData {
  centerPoint: number[];
  edgePoint: number[];
  feature: CircleFeature;
}

interface CirclesState {
  circleFeatures: CircleData[];
}

export class CustomRenderCircleControl extends CustomMapControl {
  private _mapInstance!: MapInstance;
  private _toolIsActive: boolean = false;

  private _circlesState: CirclesState = {
    circleFeatures: [],
  };
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
      this._circlesState.circleFeatures.push({
        centerPoint: this._inProgressCircleCenterPoint,
        edgePoint: coords,
        feature: circleFeature,
      });
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
  ): CircleFeature => {
    const distanceFromCircleCenterToMouseInKm = distance(circleCenterPoint, circleEdgePoint, {
      units: 'kilometers',
    });
    return this.generateCircleAtPoint(circleCenterPoint, distanceFromCircleCenterToMouseInKm);
  };

  toggleToolActive = (): void => {
    this._toolIsActive = !this._toolIsActive;
  };

  generateCircleAtPoint(point: number[], radiusInKm: number): CircleFeature {
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

    this._mapInstance.addSource(circleHandlesSource, {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    });

    this._mapInstance.addLayer({
      id: circleHandlesLayerId,
      type: 'fill',
      source: circleHandlesSource,
      paint: {
        'fill-color': 'orange',
        'fill-opacity': 1,
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

    if (this._mapInstance.getLayer(circleHandlesLayerId)) {
      this._mapInstance.removeLayer(circleHandlesLayerId);
    }
    if (this._mapInstance.getSource(circleHandlesSource)) {
      this._mapInstance.removeSource(circleHandlesSource);
    }
  };

  resetControlState = (): void => {
    this._inProgressCircleCenterPoint = undefined;
    this._circlesState = {
      circleFeatures: [],
    };
  };

  renderFinishedCirclesToMap = () => {
    const source = this._mapInstance.getSource<GeoJSONSource>(circlesSource)!;
    source.setData({
      type: 'FeatureCollection',
      features: this._circlesState.circleFeatures.map((circleData) => circleData.feature),
    });
  };

  renderInProgressCircle = (circleEdgePoint: number[]) => {
    const circle = this.generateCircleWithRadiusFromCenterPointToEdgePoint(
      this._inProgressCircleCenterPoint!,
      circleEdgePoint,
    );
    const source = this._mapInstance.getSource<GeoJSONSource>(inProgressCircleSource)!;
    source.setData({
      type: 'Feature',
      properties: {},
      geometry: circle.geometry,
    });
  };
}
