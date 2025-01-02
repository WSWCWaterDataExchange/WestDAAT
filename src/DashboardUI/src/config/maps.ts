import { nldi, pointSizes, waterRightsProperties } from './constants';

export const mapLayerNames = {
  waterRightsPointsLayer: 'waterRightsPoints',
  waterRightsPolygonsLayer: 'waterRightsPolygons',
  riverBasinsLayer: 'river-basins',
  siteLocationsPolygonsLayer: 'site-locations-polygons',
  siteLocationsPointsLayer: 'site-locations-points',
  nldiFlowlinesLayer: 'nldi-flowlines',
  nldiUsgsPointsLayer: 'nldi-usgs-points',
  nldiUsgsLocationLayer: 'nldi-usgs-location',
};

export const mapSourceNames = {
  waterRightsVectorTiles: 'water-rights-vector-tiles',
  nldiGeoJson: 'nldi-geojson',
  detailsMapGeoJson: 'details-map-geojson',
  riverBasinsGeoJson: 'river-basins-geojson',
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
  ],
  layers: [
    {
      id: mapLayerNames.riverBasinsLayer,
      friendlyName: 'River Basins',
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
      id: `${mapLayerNames.waterRightsPolygonsLayer}`,
      friendlyName: 'Water Rights Polygons - Administrative',
      'source-layer': 'polygons',
      source: mapSourceNames.waterRightsVectorTiles,
      layout: {
        visibility: 'visible',
      },
      type: 'fill',
      paint: {
        'fill-color': '#1f78b4', // Blue for Administrative
        'fill-opacity': 0.5,
      },
      filter: ['==', ['get', 'oType'], 'Administrative'],
    },
    {
      id: `${mapLayerNames.waterRightsPolygonsLayer}`,
      friendlyName: 'Water Rights Polygons - Regulatory',
      'source-layer': 'polygons',
      source: mapSourceNames.waterRightsVectorTiles,
      layout: {
        visibility: 'visible',
      },
      type: 'fill',
      paint: {
        'fill-color': '#33a02c', // Green for Regulatory
        'fill-opacity': 0.5,
      },
      filter: ['==', ['get', 'oType'], 'Regulatory'],
    },
    {
      id: `${mapLayerNames.waterRightsPolygonsLayer}`,
      friendlyName: 'Water Rights Polygons - Tribal',
      'source-layer': 'polygons',
      source: mapSourceNames.waterRightsVectorTiles,
      layout: {
        visibility: 'visible',
      },
      type: 'fill',
      paint: {
        'fill-color': '#e31a1c', // Red for Tribal
        'fill-opacity': 0.5,
      },
      filter: ['==', ['get', 'oType'], 'Tribal'],
    },
    {
      id: `${mapLayerNames.waterRightsPolygonsLayer}`,
      friendlyName: 'Water Rights Polygons - Federal',
      'source-layer': 'polygons',
      source: mapSourceNames.waterRightsVectorTiles,
      layout: {
        visibility: 'visible',
      },
      type: 'fill',
      paint: {
        'fill-color': '#ff7f00', // Orange for Federal
        'fill-opacity': 0.5,
      },
      filter: ['==', ['get', 'oType'], 'Federal'],
    },
    {
      id: `${mapLayerNames.waterRightsPolygonsLayer}`,
      friendlyName: 'Water Rights Polygons - Default',
      'source-layer': 'polygons',
      source: mapSourceNames.waterRightsVectorTiles,
      layout: {
        visibility: 'visible',
      },
      type: 'fill',
      paint: {
        'fill-color': '#6a3d9a', // Purple for Default
        'fill-opacity': 0.5,
      },
      filter: ['!', ['in', ['get', 'oType'], ['Administrative', 'Regulatory', 'Tribal', 'Federal']]],
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
      friendlyName: 'Site Locations Polygons',
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
      friendlyName: 'Site Locations Points',
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
  ],
};

export default mapsJson;
