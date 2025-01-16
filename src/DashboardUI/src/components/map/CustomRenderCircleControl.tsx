import { mdiCircle } from '@mdi/js';
import { CustomMapControl } from './CustomMapControl';
import { circle, destination, distance } from '@turf/turf';
import { Feature, GeoJsonProperties, Point, Polygon } from 'geojson';
import { GeoJSONSource, Map as MapInstance, MapMouseEvent } from 'mapbox-gl';

const circlesLayerId: string = 'circle-layer';
const circlesSourceId: string = 'circle-source';

const inProgressCircleLayerId: string = 'in-progress-circle-layer';
const inProgressCircleSourceId: string = 'in-progress-circle-source';

const circleHandlesLayerId: string = 'circle-handles-layer';
const circleHandlesSourceId: string = 'circle-handles-source';

type CircleFeature = Feature<Polygon, GeoJsonProperties>;
type HandleFeature = Feature<Point, GeoJsonProperties>;

interface CircleData {
  centerPoint: number[];
  edgePoint: number[];
  circleFeature: CircleFeature;
  handleFeatures: HandleFeature[];
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
      this.startInProgressCircle(coords);
    } else {
      this.finishInProgressCircle(coords);
    }
  };

  startInProgressCircle = (coords: number[]): void => {
    this._inProgressCircleCenterPoint = coords;
  };

  finishInProgressCircle = (coords: number[]): void => {
    // generate circle
    const circleFeature = this.generateCircleWithRadiusFromCenterPointToEdgePoint(
      this._inProgressCircleCenterPoint!,
      coords,
    );

    // generate handles
    const handleFeatures = this.generateHandlesForCircle(this._inProgressCircleCenterPoint!, coords);

    this._circlesState.circleFeatures.push({
      centerPoint: this._inProgressCircleCenterPoint!,
      edgePoint: coords,
      circleFeature,
      handleFeatures,
    });
    this._inProgressCircleCenterPoint = undefined;
    this.renderFinishedCirclesAndHandlesToMap();
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
    const distanceFromCenterToEdgeInKm = distance(circleCenterPoint, circleEdgePoint, {
      units: 'kilometers',
    });
    return this.generateCircleAtPoint(circleCenterPoint, distanceFromCenterToEdgeInKm);
  };

  generateHandlesForCircle = (circleCenterPoint: number[], circleEdgePoint: number[]): HandleFeature[] => {
    const distanceFromCenterToEdgeInKm = distance(circleCenterPoint, circleEdgePoint, {
      units: 'kilometers',
    });

    // north, east, south, west
    const cardinalDirectionBearings = [0, 90, 180, 270];

    const circleHandlesAtCardinalPoints: HandleFeature[] = cardinalDirectionBearings.map((bearing) =>
      destination(circleCenterPoint, distanceFromCenterToEdgeInKm, bearing, {
        units: 'kilometers',
      }),
    );

    return circleHandlesAtCardinalPoints;
  };

  toggleToolActive = (): void => {
    this._toolIsActive = !this._toolIsActive;
  };

  generateCircleAtPoint(point: number[], radiusInKm: number): CircleFeature {
    return circle(point, radiusInKm, { steps: 100 });
  }

  initializeSourcesAndLayers = (): void => {
    this._mapInstance.addSource(circlesSourceId, {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    });

    this._mapInstance.addLayer({
      id: circlesLayerId,
      type: 'fill',
      source: circlesSourceId,
      paint: {
        'fill-color': 'orange',
        'fill-opacity': 0.5,
      },
    });

    this._mapInstance.addSource(inProgressCircleSourceId, {
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
      source: inProgressCircleSourceId,
      paint: {
        'fill-color': 'orange',
        'fill-opacity': 0.5,
      },
    });

    this._mapInstance.addSource(circleHandlesSourceId, {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    });

    this._mapInstance.addLayer({
      id: circleHandlesLayerId,
      type: 'symbol',
      source: circleHandlesSourceId,
      layout: {
        'icon-image': 'marker-15',
        'icon-size': 2,
        'icon-allow-overlap': true, // verify if needed
      },
      paint: {
        'icon-color': 'red',
      },
    });
  };

  resetSourcesAndLayers = (): void => {
    if (this._mapInstance.getLayer(circlesLayerId)) {
      this._mapInstance.removeLayer(circlesLayerId);
    }
    if (this._mapInstance.getSource(circlesSourceId)) {
      this._mapInstance.removeSource(circlesSourceId);
    }

    if (this._mapInstance.getLayer(inProgressCircleLayerId)) {
      this._mapInstance.removeLayer(inProgressCircleLayerId);
    }
    if (this._mapInstance.getSource(inProgressCircleSourceId)) {
      this._mapInstance.removeSource(inProgressCircleSourceId);
    }

    if (this._mapInstance.getLayer(circleHandlesLayerId)) {
      this._mapInstance.removeLayer(circleHandlesLayerId);
    }
    if (this._mapInstance.getSource(circleHandlesSourceId)) {
      this._mapInstance.removeSource(circleHandlesSourceId);
    }
  };

  resetControlState = (): void => {
    this._inProgressCircleCenterPoint = undefined;
    this._circlesState = {
      circleFeatures: [],
    };
  };

  renderFinishedCirclesAndHandlesToMap = () => {
    const circlesSource = this._mapInstance.getSource<GeoJSONSource>(circlesSourceId)!;
    circlesSource.setData({
      type: 'FeatureCollection',
      features: this._circlesState.circleFeatures.map((circleData) => circleData.circleFeature),
    });

    const handlesSource = this._mapInstance.getSource<GeoJSONSource>(circleHandlesSourceId)!;
    handlesSource.setData({
      type: 'FeatureCollection',
      features: this._circlesState.circleFeatures.flatMap((circleData) => circleData.handleFeatures),
    });
  };

  renderInProgressCircle = (circleEdgePoint: number[]) => {
    const circle = this.generateCircleWithRadiusFromCenterPointToEdgePoint(
      this._inProgressCircleCenterPoint!,
      circleEdgePoint,
    );
    const source = this._mapInstance.getSource<GeoJSONSource>(inProgressCircleSourceId)!;
    source.setData({
      type: 'Feature',
      properties: {},
      geometry: circle.geometry,
    });
  };
}
