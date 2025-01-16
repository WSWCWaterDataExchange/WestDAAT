import { mdiCircle } from '@mdi/js';
import { CustomMapControl } from './CustomMapControl';
import { circle } from '@turf/circle';
import { destination } from '@turf/destination';
import { distance } from '@turf/distance';
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

interface ComponentState {
  circles: CircleData[];
}

/**
 * Custom control for drawing multiple resizable circles on the map.
 */
export class CustomRenderCircleControl extends CustomMapControl {
  private _mapInstance!: MapInstance;
  private _toolIsActive: boolean = false;

  private _circlesState: ComponentState = {
    circles: [],
  };
  private _inProgressCircleCenterPoint: number[] | undefined;

  constructor(mapInstance: MapInstance) {
    super(
      mdiCircle,
      `multiple circle tool - click to activate, click again to deactivate and remove circles from the map`,
      () => {
        this.toggleToolActive();

        this._mapInstance = mapInstance;

        if (this._toolIsActive) {
          // activate tool
          this.initializeSourcesAndLayers();
          this.enableMapEventListeners();
        } else {
          // deactivate tool
          this.removeAllSourcesAndLayers();
          this.resetControlState();
          this.disableMapEventListeners();
        }
      },
    );
  }

  enableMapEventListeners = (): void => {
    this._mapInstance.on('click', this.handleMouseClick);
    this._mapInstance.on('mousemove', this.handleMouseMove);
  };

  disableMapEventListeners = (): void => {
    this._mapInstance.off('click', this.handleMouseClick);
    this._mapInstance.off('mousemove', this.handleMouseMove);
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
    // validate marker exists in state
    const marker = e.target;
    const circleData = this._circlesState.circles.find((circleData) => circleData.cardinalMarkers.includes(marker));

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
    // 1. remove markers from the map, excluding the one being dragged
    circleData.cardinalMarkers.forEach((m) => {
      if (m !== marker) {
        m.remove();
      }
    });

    // 2. generate new markers, preserving the one being dragged
    const markerIndex = circleData.cardinalMarkers.indexOf(marker);
    const newMarkers = this.generateMarkersForCircle(circleData.centerPoint, circleData.edgePoint);
    newMarkers[markerIndex] = marker;

    // 3. overwrite markers in state
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

    this._circlesState.circles.push({
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

  removeSourceAndLayer = (sourceId: string, layerId: string): void => {
    if (this._mapInstance.getLayer(layerId)) {
      this._mapInstance.removeLayer(layerId);
    }
    if (this._mapInstance.getSource(sourceId)) {
      this._mapInstance.removeSource(sourceId);
    }
  };

  removeAllSourcesAndLayers = (): void => {
    this.removeSourceAndLayer(circlesSourceId, circlesLayerId);
    this.removeSourceAndLayer(inProgressCircleSourceId, inProgressCircleLayerId);
  };

  resetControlState = (): void => {
    // markers are attached directly to the map, so they need to be removed manually
    this._circlesState.circles.flatMap((circleData) => circleData.cardinalMarkers).forEach((m) => m.remove());

    this._inProgressCircleCenterPoint = undefined;
    this._circlesState = {
      circles: [],
    };
  };

  resetSourceData = (sourceId: string): void => {
    switch (sourceId) {
      case inProgressCircleSourceId: {
        const source = this._mapInstance.getSource<GeoJSONSource>(inProgressCircleSourceId)!;
        source.setData({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Polygon',
            coordinates: [],
          },
        });
        break;
      }
    }
  };

  renderFinishedCirclesAndMarkersToMap = () => {
    const circlesSource = this._mapInstance.getSource<GeoJSONSource>(circlesSourceId)!;
    circlesSource.setData({
      type: 'FeatureCollection',
      features: this._circlesState.circles.map((circleData) => circleData.circleFeature),
    });

    // render markers
    for (const marker of this._circlesState.circles.flatMap((circleData) => circleData.cardinalMarkers)) {
      marker.addTo(this._mapInstance);
    }

    // clear in-progress circle
    this.resetSourceData(inProgressCircleSourceId);
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
