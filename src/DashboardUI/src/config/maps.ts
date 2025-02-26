import { SymbolLayerSpecification } from 'mapbox-gl';
import { nldi, pointSizes, waterRightsProperties } from './constants';

export const mapLayerNames = {
  waterRightsPointsLayer: 'waterRightsPoints',
  waterRightsPolygonsLayer: 'waterRightsPolygons',
  overlayPolygonsLayer: 'overlayPolygons',
  overlayTypesPolygonsLayer: 'overlayTypesPolygons',
  overlayTypesPolygonsBorderLayer: 'overlayTypesPolygonsBorder',
  riverBasinsLayer: 'river-basins',
  siteLocationsPolygonsLayer: 'site-locations-polygons',
  siteLocationsPointsLayer: 'site-locations-points',
  nldiFlowlinesLayer: 'nldi-flowlines',
  nldiUsgsPointsLayer: 'nldi-usgs-points',
  nldiUsgsLocationLayer: 'nldi-usgs-location',
  timeSeriesPointsLayer: 'timeSeriesPoints',
  timeSeriesPolygonsLayer: 'timeSeriesPolygons',
  userDrawnPolygonLabelsLayer: 'user-drawn-polygon-labels',
};

export const mapSourceNames = {
  waterRightsVectorTiles: 'water-rights-vector-tiles',
  overlayVectorTiles: 'overlay-vector-tiles',
  timeSeriesVectorTiles: 'time-series-vector-tiles',
  nldiGeoJson: 'nldi-geojson',
  detailsMapGeoJson: 'details-map-geojson',
  riverBasinsGeoJson: 'river-basins-geojson',
  userDrawnPolygonLabelsGeoJson: 'user-drawn-polygon-labels-geojson',
};

export const defaultPointCircleRadius = [
  'interpolate',
  ['linear'],
  ['zoom'],
  pointSizes.minPointSizeZoomLevel,
  pointSizes.minPointSize,
  pointSizes.maxPointSizeZoomLevel,
  pointSizes.maxPointSize,
];

const defaultPointPaintConfiguration = {
  'circle-radius': defaultPointCircleRadius,
  'circle-stroke-width': 1,
  'circle-stroke-opacity': [
    'interpolate',
    ['linear'],
    ['zoom'],
    pointSizes.minPointSizeZoomLevel,
    0,
    pointSizes.maxPointSizeZoomLevel,
    0.3,
  ],
  'circle-color': '#ff0000',
  'circle-opacity': 0.75,
};

export const defaultPointCircleSortKey = ['-', 0, ['get', waterRightsProperties.minPriorityDate]];
export const flowPointCircleSortKey = ['-', 0, ['get', waterRightsProperties.maxFlowRate]];
export const volumePointCircleSortKey = ['-', 0, ['get', waterRightsProperties.maxVolume]];
export const siteLocationPolygonFillColor = [
  'case',
  ['==', ['get', 'podOrPou'], 'POD'],
  nldi.colors.sitePOD,
  nldi.colors.sitePOU,
];
export const siteLocationPointsIconImage = [
  'case',
  ['==', ['get', 'podOrPou'], 'POD'],
  `mapMarker${nldi.colors.sitePOD}`,
  `mapMarker${nldi.colors.sitePOU}`,
];

const mapsJson = {
  sources: [
    {
      id: mapSourceNames.waterRightsVectorTiles,
      type: 'vector',
      url: process.env.REACT_APP_WATER_RIGHTS_VECTOR_TILE_URL,
      volatile: true,
    },
    {
      id: mapSourceNames.overlayVectorTiles,
      type: 'vector',
      url: process.env.REACT_APP_OVERLAY_VECTOR_TILE_URL,
      volatile: true,
    },
    {
      id: mapSourceNames.timeSeriesVectorTiles,
      type: 'vector',
      url: process.env.REACT_APP_TIME_SERIES_VECTOR_TILE_URL,
      volatile: true,
    },
    {
      id: mapSourceNames.nldiGeoJson,
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    },
    {
      id: mapSourceNames.detailsMapGeoJson,
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    },
    {
      id: mapSourceNames.riverBasinsGeoJson,
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    },
    {
      id: mapSourceNames.userDrawnPolygonLabelsGeoJson,
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    },
  ],
  layers: [
    {
      id: mapLayerNames.riverBasinsLayer,
      friendlyName: 'RiverBasins',
      source: mapSourceNames.riverBasinsGeoJson,
      layout: {
        visibility: 'visible',
      },
      type: 'fill',
      paint: {
        'fill-color': nldi.colors.riverBasin,
        'fill-opacity': 0.3,
      },
    },
    {
      id: mapLayerNames.overlayTypesPolygonsLayer,
      friendlyName: 'Overlay Types Polygons',
      'source-layer': 'polygons',
      source: mapSourceNames.overlayVectorTiles,
      layout: {
        visibility: 'visible',
      },
      type: 'fill',
      paint: {
        'fill-color': '#ff0000',
        'fill-opacity': 0.5,
      },
    },
    {
      id: mapLayerNames.overlayTypesPolygonsBorderLayer,
      friendlyName: 'Overlay Types Polygons Borders',
      'source-layer': 'polygons',
      source: mapSourceNames.overlayVectorTiles,
      layout: {
        visibility: 'visible',
      },
      type: 'line',
      paint: {
        'line-color': '#000000',
        'line-width': 0.2,
        'line-opacity': 0.5,
      },
    },
    {
      id: mapLayerNames.waterRightsPolygonsLayer,
      friendlyName: 'Water Rights Polygons',
      'source-layer': 'polygons',
      source: mapSourceNames.waterRightsVectorTiles,
      layout: {
        visibility: 'visible',
      },
      type: 'fill',
      paint: {
        'fill-color': '#ff0000',
        'fill-opacity': 0.5,
      },
      filter: ['has', 'podPou'],
    },
    {
      id: mapLayerNames.waterRightsPointsLayer,
      friendlyName: 'Water Rights Points',
      'source-layer': 'points',
      source: mapSourceNames.waterRightsVectorTiles,
      layout: {
        visibility: 'none',
        'circle-sort-key': defaultPointCircleSortKey,
      },
      type: 'circle',
      paint: defaultPointPaintConfiguration,
    },
    {
      id: mapLayerNames.siteLocationsPolygonsLayer,
      friendlyName: 'SiteLocations',
      source: mapSourceNames.detailsMapGeoJson,
      layout: {
        visibility: 'visible',
      },
      type: 'fill',
      paint: {
        'fill-opacity': 0.5,
        'fill-color': siteLocationPolygonFillColor,
      },
      filter: ['in', ['geometry-type'], ['literal', ['Polygon', 'MultiPolygon']]],
    },
    {
      id: mapLayerNames.siteLocationsPointsLayer,
      friendlyName: 'SiteLocations',
      source: mapSourceNames.detailsMapGeoJson,
      layout: {
        visibility: 'visible',
        'icon-image': siteLocationPointsIconImage,
        'icon-anchor': 'bottom',
        'icon-size': ['interpolate', ['linear'], ['zoom'], 5, 0.5, 15, 1],
        'icon-allow-overlap': true,
      },
      type: 'symbol',
      filter: ['in', ['geometry-type'], ['literal', ['Point', 'MultiPoint']]],
    },
    {
      id: mapLayerNames.nldiFlowlinesLayer,
      source: mapSourceNames.nldiGeoJson,
      layout: {
        visibility: 'visible',
      },
      type: 'line',
      paint: {
        'line-color': [
          'case',
          ['==', ['get', 'westdaat_channeltype'], 'Main'],
          nldi.colors.mainstem,
          nldi.colors.tributaries,
        ],
        'line-opacity': 1,
        'line-width': ['case', ['==', ['get', 'westdaat_channeltype'], 'Main'], 2, 1],
      },
      filter: ['==', ['get', 'westdaat_featuredatatype'], 'Flowline'],
    },
    {
      id: mapLayerNames.nldiUsgsPointsLayer,
      source: mapSourceNames.nldiGeoJson,
      layout: {
        visibility: 'visible',
      },
      type: 'circle',
      paint: {
        ...defaultPointPaintConfiguration,
        'circle-color': [
          'case',
          ['==', ['get', 'westdaat_pointdatasource'], 'UsgsSurfaceWaterSite'],
          nldi.colors.usgs,
          ['==', ['get', 'westdaat_pointdatasource'], 'EpaWaterQualitySite'],
          nldi.colors.epa,
          ['==', ['get', 'westdaat_pointdatasource'], 'Wade'],
          nldi.colors.wade,
          nldi.colors.unknown,
        ],
      },
      filter: [
        'all',
        ['==', ['get', 'westdaat_featuredatatype'], 'Point'],
        ['!=', ['get', 'westdaat_pointdatasource'], 'Location'],
      ],
    },
    {
      id: mapLayerNames.nldiUsgsLocationLayer,
      source: mapSourceNames.nldiGeoJson,
      layout: {
        visibility: 'visible',
        'icon-image': `mapMarker${nldi.colors.mapMarker}`,
        'icon-anchor': 'bottom',
        'icon-size': ['interpolate', ['linear'], ['zoom'], 5, 0.5, 15, 1],
      },
      type: 'symbol',
      filter: ['==', ['get', 'westdaat_pointdatasource'], 'Location'],
    },
    /*    {
      id: mapLayerNames.timeSeriesPolygonsLayer,
      friendlyName: 'Time Series Polygons',
      'source-layer': 'polygons',
      source: mapSourceNames.timeSeriesVectorTiles,
      layout: {
        visibility: 'visible',
      },
      type: 'fill',
      paint: {
        'fill-color': '#008080',
        'fill-opacity': 0.75,
      },
    },*/
    {
      id: mapLayerNames.timeSeriesPointsLayer,
      friendlyName: 'Time Series Points',
      'source-layer': 'points',
      source: mapSourceNames.timeSeriesVectorTiles,
      layout: {
        visibility: 'visible',
      },
      type: 'circle',
      paint: {
        'circle-radius': defaultPointCircleRadius,
        'circle-stroke-width': 1,
        'circle-stroke-opacity': [
          'interpolate',
          ['linear'],
          ['zoom'],
          pointSizes.minPointSizeZoomLevel,
          0,
          pointSizes.maxPointSizeZoomLevel,
          0.3,
        ],
        'circle-color': '#FF7F50',
        'circle-opacity': 0.75,
      },
    },
    {
      id: mapLayerNames.userDrawnPolygonLabelsLayer,
      type: 'symbol',
      source: mapSourceNames.userDrawnPolygonLabelsGeoJson,
      layout: {
        'text-field': ['get', 'title'],
        'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
        'text-size': 20,
        'text-justify': 'center',
        'text-letter-spacing': 0.1,
        'icon-image': ['get', 'icon'],
      },
      paint: {
        'text-halo-color': '#fff',
        'text-halo-width': 0.75,
      },
    } as SymbolLayerSpecification,
  ],
};

export default mapsJson;
