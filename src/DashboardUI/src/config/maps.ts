import { nldi } from "./constants";

const pointCircleRadius = ["interpolate", ["linear"], ["zoom"], 5, 2, 20, 20];

const mapsJson = {
  "sources": [
    {
      "id": "allocation-sites_1",
      "type": "vector",
      "url": "mapbox://amabdallah.70zvl3m1"
    },
    {
      "id": "allocation-sites_2",
      "type": "vector",
      "url": "mapbox://amabdallah.3ghcfjn8"
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
  ],
  "layers": [
    {
      "id": "aquaculture",
      "friendlyName": "Aquaculture",
      "source-layer": "aquaculture",
      "source": "allocation-sites_1",
      "layout": {
        "visibility": "visible"
      },
      "type": "circle",
      "paint": {
        "circle-radius": pointCircleRadius,
        "circle-color": "#9ACD32"
      }
    },
    {
      "id": "commercial",
      "source-layer": "commercial",
      "friendlyName": "Commercial",
      "source": "allocation-sites_1",
      "layout": {
        "visibility": "visible"
      },
      "type": "circle",
      "paint": {
        "circle-radius": pointCircleRadius,
        "circle-color": "#FF00E6"
      }
    },
    {
      "id": "domestic",
      "source-layer": "domestic",
      "friendlyName": "Domestic",
      "source": "allocation-sites_1",
      "layout": {
        "visibility": "visible"
      },
      "type": "circle",
      "paint": {
        "circle-radius": pointCircleRadius,
        "circle-color": "#0000FF"
      }
    },
    {
      "id": "environmental",
      "source-layer": "environmental",
      "friendlyName": "Environmental",
      "source": "allocation-sites_1",
      "layout": {
        "visibility": "visible"
      },
      "type": "circle",
      "paint": {
        "circle-radius": pointCircleRadius,
        "circle-color": "#32CD32"
      }
    },
    {
      "id": "fire",
      "source-layer": "fire",
      "friendlyName": "Fire",
      "source": "allocation-sites_1",
      "layout": {
        "visibility": "visible"
      },
      "type": "circle",
      "paint": {
        "circle-radius": pointCircleRadius,
        "circle-color": "#FF4500"
      }
    },
    {
      "id": "fish",
      "source-layer": "fish",
      "friendlyName": "Fish",
      "source": "allocation-sites_1",
      "layout": {
        "visibility": "visible"
      },
      "type": "circle",
      "paint": {
        "circle-radius": pointCircleRadius,
        "circle-color": "#9370DB"
      }
    },
    {
      "id": "flood",
      "source-layer": "flood",
      "friendlyName": "Flood Control",
      "source": "allocation-sites_1",
      "layout": {
        "visibility": "visible"
      },
      "type": "circle",
      "paint": {
        "circle-radius": pointCircleRadius,
        "circle-color": "#00FFFF"
      }
    },
    {
      "id": "heating",
      "source-layer": "heating",
      "friendlyName": "Heating and Cooling",
      "source": "allocation-sites_1",
      "layout": {
        "visibility": "visible"
      },
      "type": "circle",
      "paint": {
        "circle-radius": pointCircleRadius,
        "circle-color": "#FF69B4"
      }
    },
    {
      "id": "industrial",
      "source-layer": "industrial",
      "friendlyName": "Industrial",
      "source": "allocation-sites_1",
      "layout": {
        "visibility": "visible"
      },
      "type": "circle",
      "paint": {
        "circle-radius": pointCircleRadius,
        "circle-color": "#800080"
      }
    },
    {
      "id": "instream",
      "source-layer": "instream",
      "friendlyName": "Instream Flow",
      "source": "allocation-sites_2",
      "layout": {
        "visibility": "visible"
      },
      "type": "circle",
      "paint": {
        "circle-radius": pointCircleRadius,
        "circle-color": "#00BFFF"
      }
    },
    {
      "id": "livestock",
      "source-layer": "livestock",
      "friendlyName": "Livestock",
      "source": "allocation-sites_2",
      "layout": {
        "visibility": "visible"
      },
      "type": "circle",
      "paint": {
        "circle-radius": pointCircleRadius,
        "circle-color": "#FFD700"
      }
    },
    {
      "id": "mining",
      "source-layer": "mining",
      "friendlyName": "Mining",
      "source": "allocation-sites_2",
      "layout": {
        "visibility": "visible"
      },
      "type": "circle",
      "paint": {
        "circle-radius": pointCircleRadius,
        "circle-color": "#A52A2A"
      }
    },
    {
      "id": "municipal",
      "source-layer": "municipal",
      "friendlyName": "Municipal",
      "source": "allocation-sites_2",
      "layout": {
        "visibility": "visible"
      },
      "type": "circle",
      "paint": {
        "circle-radius": pointCircleRadius,
        "circle-color": "#4B0082"
      }
    },
    {
      "id": "other",
      "source-layer": "other",
      "friendlyName": "Other",
      "source": "allocation-sites_2",
      "layout": {
        "visibility": "visible"
      },
      "type": "circle",
      "paint": {
        "circle-radius": pointCircleRadius,
        "circle-color": "#808080"
      }
    },
    {
      "id": "power",
      "source-layer": "power",
      "friendlyName": "Power",
      "source": "allocation-sites_2",
      "layout": {
        "visibility": "visible"
      },
      "type": "circle",
      "paint": {
        "circle-radius": pointCircleRadius,
        "circle-color": "#FFA500"
      }
    },
    {
      "id": "recharge",
      "source-layer": "recharge",
      "friendlyName": "Recharge",
      "source": "allocation-sites_2",
      "layout": {
        "visibility": "visible"
      },
      "type": "circle",
      "paint": {
        "circle-radius": pointCircleRadius,
        "circle-color": "#D2691E"
      }
    },
    {
      "id": "recreation",
      "source-layer": "recreation",
      "friendlyName": "Recreation",
      "source": "allocation-sites_2",
      "layout": {
        "visibility": "visible"
      },
      "type": "circle",
      "paint": {
        "circle-radius": pointCircleRadius,
        "circle-color": "#FFC0CB"
      }
    },
    {
      "id": "snow",
      "source-layer": "snow",
      "friendlyName": "Snow Making",
      "source": "allocation-sites_2",
      "layout": {
        "visibility": "visible"
      },
      "type": "circle",
      "paint": {
        "circle-radius": pointCircleRadius,
        "circle-color": "#F0FFF0"
      }
    },
    {
      "id": "storage",
      "source-layer": "storage",
      "friendlyName": "Storage",
      "source": "allocation-sites_2",
      "layout": {
        "visibility": "visible"
      },
      "type": "circle",
      "paint": {
        "circle-radius": pointCircleRadius,
        "circle-color": "#F5DEB3"
      }
    },
    {
      "id": "wildlife",
      "source-layer": "wildlife",
      "friendlyName": "Wildlife",
      "source": "allocation-sites_2",
      "layout": {
        "visibility": "visible"
      },
      "type": "circle",
      "paint": {
        "circle-radius": pointCircleRadius,
        "circle-color": "#FF0000"
      }
    },
    {
      "id": "agricultural",
      "source-layer": "agricultural",
      "friendlyName": "Agricultural",
      "source": "allocation-sites_1",
      "layout": {
        "visibility": "visible"
      },
      "type": "circle",
      "paint": {
        "circle-radius": pointCircleRadius,
        "circle-color": "#006400"
      }
    },
    {
      "id": "site-locations",
      "friendlyName": "SiteLocations",
      "source": "site-locations",
      "layout": {
        "visibility": "visible"
      },
      "type": "circle",
      "paint": {
        "circle-radius": pointCircleRadius,
        "circle-color": "#01579b"
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
        "text-color": "#01579b",
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
        "line-color": [
          "case",
          [
            "==",
            [
              "get",
              "westdaat_channeltype"
            ],
            "Main"
          ],
          nldi.colors.mainstem,
          nldi.colors.tributaries
        ],
        "line-opacity": 1,
        "line-width": [
          "case",
          [
            "==",
            [
              "get",
              "westdaat_channeltype"
            ],
            "Main"
          ],
          2,
          1
        ]
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
      "filter": ["all", [
        "==",
        [
          "get",
          "westdaat_featuredatatype"
        ],
        "Point"
      ],
        [
          "!=",
          [
            "get",
            "westdaat_pointdatasource"
          ],
          "Location"
        ]
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
      "filter": [
        "==",
        [
          "get",
          "westdaat_pointdatasource"
        ],
        "Location"
      ]
    }
  ]
}

export default mapsJson;