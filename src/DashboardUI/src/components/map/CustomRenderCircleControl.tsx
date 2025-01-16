import { mdiCircle } from '@mdi/js';
import { CustomMapControl } from './CustomMapControl';
import { circle, destination, distance } from '@turf/turf';
import { Feature, GeoJsonProperties, Polygon } from 'geojson';
import { GeoJSONSource, Map as MapInstance, MapMouseEvent, Marker } from 'mapbox-gl';

const circlesLayerId: string = 'circle-layer';
const circlesSourceId: string = 'circle-source';

const inProgressCircleLayerId: string = 'in-progress-circle-layer';
const inProgressCircleSourceId: string = 'in-progress-circle-source';

type CircleFeature = Feature<Polygon, GeoJsonProperties>;

interface CircleData {
  centerPoint: number[];
  edgePoint: number[];
  circleFeature: CircleFeature;
  cardinalMarkers: Marker[];
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

  handleMouseMove = (e: MapMouseEvent) => {
    // render the potential circle only while the first coord is set
    if (!this._inProgressCircleCenterPoint) {
      return;
    }
    const coords = [e.lngLat.lng, e.lngLat.lat];
    this.renderInProgressCircle(coords);
  };

  handleMarkerDrag = (e: { type: 'drag'; target: Marker }): void => {
    // validate marker exists
    const marker = e.target;
    const circleData = this._circlesState.circleFeatures.find((circleData) =>
      circleData.cardinalMarkers.includes(marker),
    );

    if (!circleData) {
      throw new Error('Marker not found');
    }

    // update the circle to match the marker's new location
    const markerCoords = marker.getLngLat();
    circleData.edgePoint = [markerCoords.lng, markerCoords.lat];

    circleData.circleFeature = this.generateCircleWithRadiusFromCenterPointToEdgePoint(
      circleData.centerPoint,
      circleData.edgePoint,
    );

    // update circle's markers
    // 1. remove markers, excluding the one being dragged
    circleData.cardinalMarkers.forEach((m) => {
      if (m !== marker) {
        m.remove();
      }
    });

    // 2. generate new markers, preserving the one being dragged
    const markerIndex = circleData.cardinalMarkers.indexOf(marker);
    const newMarkers = this.generateMarkersForCircle(circleData.centerPoint, circleData.edgePoint);
    newMarkers[markerIndex] = marker;

    // 3. attach to state
    circleData.cardinalMarkers = newMarkers;

    // 4. re-render
    this.renderFinishedCirclesAndMarkersToMap();
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

    // generate markers
    const markers = this.generateMarkersForCircle(this._inProgressCircleCenterPoint!, coords);

    this._circlesState.circleFeatures.push({
      centerPoint: this._inProgressCircleCenterPoint!,
      edgePoint: coords,
      circleFeature,
      cardinalMarkers: markers,
    });
    this._inProgressCircleCenterPoint = undefined;
    this.renderFinishedCirclesAndMarkersToMap();
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

  generateMarkersForCircle = (circleCenterPoint: number[], circleEdgePoint: number[]): Marker[] => {
    const distanceFromCenterToEdgeInKm = distance(circleCenterPoint, circleEdgePoint, {
      units: 'kilometers',
    });

    // north, east, south, west
    const cardinalDirectionBearings = [0, 90, 180, 270];

    const circleMarkersAtCardinalPoints: Marker[] = cardinalDirectionBearings
      .map((bearing) =>
        destination(circleCenterPoint, distanceFromCenterToEdgeInKm, bearing, {
          units: 'kilometers',
        }),
      )
      .map((dest) => {
        const marker = new Marker({
          draggable: true,
        }).setLngLat(dest.geometry.coordinates as [number, number]);

        marker.on('drag', this.handleMarkerDrag);

        return marker;
      });

    return circleMarkersAtCardinalPoints;
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
  };

  resetControlState = (): void => {
    this._inProgressCircleCenterPoint = undefined;
    this._circlesState = {
      circleFeatures: [],
    };
  };

  renderFinishedCirclesAndMarkersToMap = () => {
    const circlesSource = this._mapInstance.getSource<GeoJSONSource>(circlesSourceId)!;
    circlesSource.setData({
      type: 'FeatureCollection',
      features: this._circlesState.circleFeatures.map((circleData) => circleData.circleFeature),
    });

    // render markers
    for (const marker of this._circlesState.circleFeatures.flatMap((circleData) => circleData.cardinalMarkers)) {
      marker.addTo(this._mapInstance);
    }
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
