import { nldi } from "./constants";

const pointCircleRadius = ["interpolate", ["linear"], ["zoom"], 5, 2, 20, 20];

const mapsJson = {
  "sources": [
    {
      "id": "allocation-sites_1",
      "type": "vector",
      "url": "https://api.maptiler.com/tiles/6d61092a-7c8a-4cd1-8272-d92cf019730c/tiles.json?key=IauIQDaqjd29nJc5kJse",
      "volatile": true
    },
    {
      "id": "nldi",
      "type": "geojson",
      "data": {
        "type": "FeatureCollection",
        "features": []
      }
    }
  ],
  "layers": [
    {
      "id": "allocations",
      "friendlyName": "Aquaculture",
      "source-layer": "allocations",
      "source": "allocation-sites_1",
      "layout": {
        "visibility": "visible"
      },
      "type": "circle",
      "paint": {
        "circle-radius": pointCircleRadius,
        "circle-color": "#ff0000"
      }
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
        "circle-radius": pointCircleRadius,
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