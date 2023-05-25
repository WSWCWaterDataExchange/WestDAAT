import { nldi, pointSizes, waterRightsProperties } from "./constants";

export const mapLayerNames = {
  waterRightsPointsLayer: 'waterRightsPoints',
  waterRightsPolygonsLayer: 'waterRightsPolygons',
  riverBasinsLayer: 'river-basins',
  siteLocationsPolygonsLayer: 'site-locations-polygons',
  siteLocationsPointsLayer: 'site-locations-points',
  nldiFlowlinesLayer: 'nldi-flowlines',
  nldiUsgsPointsLayer: 'nldi-usgs-points',
  nldiUsgsLocationLayer: 'nldi-usgs-location'
}


export const defaultPointCircleRadius = [
  "interpolate",
  ["linear"],
  ["zoom"],
  pointSizes.minPointSizeZoomLevel, pointSizes.minPointSize,
  pointSizes.maxPointSizeZoomLevel, pointSizes.maxPointSize,
];

const defaultPointPaintConfiguration = {
  "circle-radius": defaultPointCircleRadius,
  "circle-stroke-width": 1,
  "circle-stroke-opacity": [
    "interpolate",
    ["linear"],
    ["zoom"],
    pointSizes.minPointSizeZoomLevel, 0,
    pointSizes.maxPointSizeZoomLevel, .3,
  ],
  "circle-color": "#ff0000",
  "circle-opacity": .75
}

export const defaultPointCircleSortKey = ["-", 0, ["get", waterRightsProperties.minPriorityDate]];
export const flowPointCircleSortKey = ["-", 0, ["get", waterRightsProperties.maxFlowRate]];
export const volumePointCircleSortKey = ["-", 0, ["get", waterRightsProperties.maxVolume]];

const mapsJson = {
  "sources": [
    {
      "id": "allocation-sites_1",
      "type": "vector",
      "url": process.env.REACT_APP_WATER_RIGHTS_VECTOR_TILE_URL,
      "volatile": true
    },
    {
      "id": "nldi",
      "type": "geojson",
      "data": {
        "type": "FeatureCollection",
        "features": []
      }
    },
    {
      "id": "site-locations",
      "type": "geojson",
      "data": {
        "type": "FeatureCollection",
        "features": []
      }
    },
    {
      "id": "river-basins",
      "type": "geojson",
      "data": {
        "type": "FeatureCollection",
        "features": []
      }
    },
  ],
  "layers": [
    {
      "id": mapLayerNames.riverBasinsLayer,
      "friendlyName": "RiverBasins",
      "source": "river-basins",
      "layout": {
        "visibility": "visible"
      },
      "type": "fill",
      'paint': {
        'fill-color': nldi.colors.riverBasin,
        'fill-opacity': 0.3
      }
    },
    {
      "id": mapLayerNames.waterRightsPolygonsLayer,
      "friendlyName": "Water Rights Polygons",
      "source-layer": "polygons",
      "source": "allocation-sites_1",
      "layout": {
        "visibility": "visible"
      },
      "type": "fill",
      "paint": {
        "fill-color": "#ff0000",
        "fill-opacity": .5
      }
    },
    {
      "id": mapLayerNames.waterRightsPointsLayer,
      "friendlyName": "Water Rights Points",
      "source-layer": "points",
      "source": "allocation-sites_1",
      "layout": {
        "visibility": "none",
        "circle-sort-key": defaultPointCircleSortKey
      },
      "type": "circle",
      "paint": defaultPointPaintConfiguration,
    },
    {
      "id": mapLayerNames.siteLocationsPolygonsLayer,
      "friendlyName": "SiteLocations",
      "source": "site-locations",
      "layout": {
        "visibility": "visible"
      },
      "type": "fill",
      "paint": {
        "fill-opacity": .5,
        "fill-color": ["case",
          ["==", ["get", "podOrPou"], "POD"], nldi.colors.sitePOD,
          nldi.colors.sitePOU],
      },
      "filter": ["in", ["geometry-type"], ["literal", ["Polygon", "MultiPolygon"]]]
    },
    {
      "id": mapLayerNames.siteLocationsPointsLayer,
      "friendlyName": "SiteLocations",
      "source": "site-locations",
      "layout": {
        "visibility": "visible",
        "icon-image": ["case",
          ["==", ["get", "podOrPou"], "POD"], "mapMarkerPOD",
          "mapMarkerPOU"],
        "icon-anchor": "bottom",
        "icon-size": ["interpolate", ["linear"], ["zoom"], 5, .5, 15, 1],
        "icon-allow-overlap": true,

      },
      "type": "symbol",
      "filter": ["in", ["geometry-type"], ["literal", ["Point", "MultiPoint"]]]
    },
    {
      "id": mapLayerNames.nldiFlowlinesLayer,
      "source": "nldi",
      "layout": {
        "visibility": "visible"
      },
      "type": "line",
      "paint": {
        "line-color": ["case",
          ["==", ["get", "westdaat_channeltype"], "Main"], nldi.colors.mainstem,
          nldi.colors.tributaries],
        "line-opacity": 1,
        "line-width": ["case",
          ["==", ["get", "westdaat_channeltype"], "Main"], 2,
          1]
      },
      "filter": [
        "==",
        [
          "get",
          "westdaat_featuredatatype"
        ],
        "Flowline"
      ]
    },
    {
      "id": mapLayerNames.nldiUsgsPointsLayer,
      "source": "nldi",
      "layout": {
        "visibility": "visible"
      },
      "type": "circle",
      "paint": {
        ...defaultPointPaintConfiguration,
        "circle-color": ["case",
          ["==", ["get", "westdaat_pointdatasource"], "UsgsSurfaceWaterSite"], nldi.colors.usgs,
          ["==", ["get", "westdaat_pointdatasource"], "EpaWaterQualitySite"], nldi.colors.epa,
          ["==", ["get", "westdaat_pointdatasource"], "Wade"], nldi.colors.wade,
          nldi.colors.unknown]
      },
      "filter": ["all",
        ["==", ["get", "westdaat_featuredatatype"], "Point"],
        ["!=", ["get", "westdaat_pointdatasource"], "Location"]
      ]
    },
    {
      "id": mapLayerNames.nldiUsgsLocationLayer,
      "source": "nldi",
      "layout": {
        "visibility": "visible",
        "icon-image": "mapMarker",
        "icon-anchor": "bottom",
        "icon-size": ["interpolate", ["linear"], ["zoom"], 5, .5, 15, 1]
      },
      "type": "symbol",
      "filter": ["==", ["get", "westdaat_pointdatasource"], "Location"]
    }
  ]
}

export default mapsJson;