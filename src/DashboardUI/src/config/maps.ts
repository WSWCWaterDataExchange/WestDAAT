import { nldi, pointSizes } from "./constants";

export const defaultPointCircleRadius = [
  "interpolate",
  ["linear"],
  ["zoom"],
  pointSizes.minPointSizeZoomLevel, pointSizes.minPointSize,
  pointSizes.maxPointSizeZoomLevel, pointSizes.maxPointSize,
];

const mapsJson = {
  "sources": [
    {
      "id": "allocation-sites_1",
      "type": "vector",
      "url": "https://api.maptiler.com/tiles/acf2ef77-3afa-4100-9a97-13bdce51772b/tiles.json?key=IauIQDaqjd29nJc5kJse",
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
      "id": "waterRightsPolygons",
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
      "id": "waterRightsPoints",
      "friendlyName": "Water Rights Points",
      "source-layer": "points",
      "source": "allocation-sites_1",
      "layout": {
        "visibility": "none"
      },
      "type": "circle",
      "paint": {
        "circle-radius": defaultPointCircleRadius,
        "circle-color": "#ff0000"
      },
    },
    {
      "id": "site-locations-polygons",
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
      "id": "site-locations-points",
      "friendlyName": "SiteLocations",
      "source": "site-locations",
      "layout": {
        "visibility": "visible"
      },
      "type": "circle",
      "paint": {
        "circle-radius": defaultPointCircleRadius,
        "circle-color": ["case",
          ["==", ["get", "podOrPou"], "POD"], nldi.colors.sitePOD,
          nldi.colors.sitePOU],
      },
      "filter": ["in", ["geometry-type"], ["literal", ["Point", "MultiPoint"]]]
    },
    {
      "id": "river-basins",
      "friendlyName": "RiverBasins",
      "source": "river-basins",
      "layout": {
        "visibility": "visible"
      },
      "type": "fill",
      'paint': {
        'fill-color': '#088',
        'fill-opacity': 0.3
      }
    },
    {
      "id": "site-locations-label",
      "friendlyName": "SiteLocationsLabel",
      "source": "site-locations",
      "type": "symbol",
      "layout": {
        "visibility": "visible",
        "text-field": ["get", "siteUuid"],
        "text-size": 16,
        "text-offset": [0, -1.5],
      },
      "paint": {
        "text-color": "#000000",
        "text-halo-color": "#ffffff",
        "text-halo-width": 0.5,
      },
    },
    {
      "id": "nldi-flowlines",
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
      "id": "nldi-usgs-points",
      "source": "nldi",
      "layout": {
        "visibility": "visible"
      },
      "type": "circle",
      "paint": {
        "circle-radius": defaultPointCircleRadius,
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
      "id": "nldi-usgs-location",
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