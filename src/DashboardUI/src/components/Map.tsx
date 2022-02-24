import mapboxgl from 'mapbox-gl';
import { useEffect, useState } from 'react';

import '../styles/map.scss';

interface MapProps {
}

function Map(props: MapProps) {

  useEffect(() => {
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESSTOKEN || "";
    let map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/light-v10',
      center: [-100, 40],
      zoom: 4,
    });

    loadData(map);
  });

  const loadData = (map: mapboxgl.Map) => {

    map.on('load', function () {
      let circleRadius = {
        'base': 1.25,
        'stops': [
          [0, 2],
          [7, 2],
          [10, 4],
          [15, 20],
          [20, 40]
        ]
      }

      map.addSource('allocation-sites_1', {
        type: "vector",
        url: "mapbox://amabdallah.70zvl3m1"
      });

      map.addSource('allocation-sites_2', {
        type: "vector",
        url: "mapbox://amabdallah.3ghcfjn8"
      });

      map.addLayer({
        'id': 'aquaculture',
        'source-layer': 'aquaculture',
        'source': 'allocation-sites_1',
        'layout': {
          'visibility': 'visible'
        },
        'type': 'circle',
        'paint': {
          'circle-radius': circleRadius,
          'circle-color': '#9ACD32'
        }
      });

      map.addLayer({
        'id': 'commercial',
        'source-layer': 'commercial',
        'source': 'allocation-sites_1',
        'layout': {
          'visibility': 'visible'
        },
        'type': 'circle',
        'paint': {
          'circle-radius': circleRadius,
          'circle-color': '#FF00E6'
        }
      });

      map.addLayer({
        'id': 'domestic',
        'source-layer': 'domestic',
        'source': 'allocation-sites_1',
        'layout': {
          'visibility': 'visible'
        },
        'type': 'circle',
        'paint': {
          'circle-radius': circleRadius,
          'circle-color': '#0000FF'
        }
      });

      map.addLayer({
        'id': 'environmental',
        'source-layer': 'environmental',
        'source': 'allocation-sites_1',
        'layout': {
          'visibility': 'visible'
        },
        'type': 'circle',
        'paint': {
          'circle-radius': circleRadius,
          'circle-color': '#32CD32'
        }
      });

      map.addLayer({
        'id': 'fire',
        'source-layer': 'fire',
        'source': 'allocation-sites_1',
        'layout': {
          'visibility': 'visible'
        },
        'type': 'circle',
        'paint': {
          'circle-radius': circleRadius,
          'circle-color': '#FF4500'
        }
      });

      map.addLayer({
        'id': 'fish',
        'source-layer': 'fish',
        'source': 'allocation-sites_1',
        'layout': {
          'visibility': 'visible'
        },
        'type': 'circle',
        'paint': {
          'circle-radius': circleRadius,
          'circle-color': '#9370DB'
        }
      });

      map.addLayer({
        'id': 'flood',
        'source-layer': 'flood',
        'source': 'allocation-sites_1',
        'layout': {
          'visibility': 'visible'
        },
        'type': 'circle',
        'paint': {
          'circle-radius': circleRadius,
          'circle-color': '#00FFFF'
        }
      });

      map.addLayer({
        'id': 'heating',
        'source-layer': 'heating',
        'source': 'allocation-sites_1',
        'layout': {
          'visibility': 'visible'
        },
        'type': 'circle',
        'paint': {
          'circle-radius': circleRadius,
          'circle-color': '#FF69B4'
        }
      });

      map.addLayer({
        'id': 'industrial',
        'source-layer': 'industrial',
        'source': 'allocation-sites_1',
        'layout': {
          'visibility': 'visible'
        },
        'type': 'circle',
        'paint': {
          'circle-radius': circleRadius,
          'circle-color': '#800080'
        }
      });

      map.addLayer({
        'id': 'instream',
        'source-layer': 'instream',
        'source': 'allocation-sites_2',
        'layout': {
          'visibility': 'visible'
        },
        'type': 'circle',
        'paint': {
          'circle-radius': circleRadius,
          'circle-color': '#00BFFF'
        }
      });

      map.addLayer({
        'id': 'livestock',
        'source-layer': 'livestock',
        'source': 'allocation-sites_2',
        'layout': {
          'visibility': 'visible'
        },
        'type': 'circle',
        'paint': {
          'circle-radius': circleRadius,
          'circle-color': '#FFD700'
        }
      });

      map.addLayer({
        'id': 'mining',
        'source-layer': 'mining',
        'source': 'allocation-sites_2',
        'layout': {
          'visibility': 'visible'
        },
        'type': 'circle',
        'paint': {
          'circle-radius': circleRadius,
          'circle-color': '#A52A2A'
        }
      });

      map.addLayer({
        'id': 'municipal',
        'source-layer': 'municipal',
        'source': 'allocation-sites_2',
        'layout': {
          'visibility': 'visible'
        },
        'type': 'circle',
        'paint': {
          'circle-radius': circleRadius,
          'circle-color': '#4B0082'
        }
      });

      map.addLayer({
        'id': 'other',
        'source-layer': 'other',
        'source': 'allocation-sites_2',
        'layout': {
          'visibility': 'visible'
        },
        'type': 'circle',
        'paint': {
          'circle-radius': circleRadius,
          'circle-color': '#808080'
        }
      });

      map.addLayer({
        'id': 'power',
        'source-layer': 'power',
        'source': 'allocation-sites_2',
        'layout': {
          'visibility': 'visible'
        },
        'type': 'circle',
        'paint': {
          'circle-radius': circleRadius,
          'circle-color': '#FFA500'
        }
      });

      map.addLayer({
        'id': 'recharge',
        'source-layer': 'recharge',
        'source': 'allocation-sites_2',
        'layout': {
          'visibility': 'visible'
        },
        'type': 'circle',
        'paint': {
          'circle-radius': circleRadius,
          'circle-color': '#D2691E'
        }
      });

      map.addLayer({
        'id': 'recreation',
        'source-layer': 'recreation',
        'source': 'allocation-sites_2',
        'layout': {
          'visibility': 'visible'
        },
        'type': 'circle',
        'paint': {
          'circle-radius': circleRadius,
          'circle-color': '#FFC0CB'
        }
      });

      map.addLayer({
        'id': 'snow',
        'source-layer': 'snow',
        'source': 'allocation-sites_2',
        'layout': {
          'visibility': 'visible'
        },
        'type': 'circle',
        'paint': {
          'circle-radius': circleRadius,
          'circle-color': '#F0FFF0'
        }
      });

      map.addLayer({
        'id': 'storage',
        'source-layer': 'storage',
        'source': 'allocation-sites_2',
        'layout': {
          'visibility': 'visible'
        },
        'type': 'circle',
        'paint': {
          'circle-radius': circleRadius,
          'circle-color': '#F5DEB3'
        }
      });

      map.addLayer({
        'id': 'unspecified',
        'source-layer': 'unspecified',
        'source': 'allocation-sites_2',
        'layout': {
          'visibility': 'visible'
        },
        'type': 'circle',
        'paint': {
          'circle-radius': circleRadius,
          'circle-color': '#D3D3D3'
        }
      });

      map.addLayer({
        'id': 'wildlife',
        'source-layer': 'wildlife',
        'source': 'allocation-sites_2',
        'layout': {
          'visibility': 'visible'
        },
        'type': 'circle',
        'paint': {
          'circle-radius': circleRadius,
          'circle-color': '#FF0000'
        }
      });

      map.addLayer({
        'id': 'agricultural',
        'source-layer': 'agricultural',
        'source': 'allocation-sites_1',
        'layout': {
          'visibility': 'visible'
        },
        'type': 'circle',
        'paint': {
          'circle-radius': circleRadius,
          'circle-color': '#006400'
        }
      });
    });
  }

  return (
    <div className="position-relative h-100">
      <div className='legend'>
        <div>
          <div><span style={{ "backgroundColor": "#006400" }}></span>Agricultural</div>
          <div><span style={{ "backgroundColor": "#9ACD32" }}></span>Aquaculture</div>
          <div><span style={{ "backgroundColor": "#FF00E6" }}></span>Commercial</div>
          <div><span style={{ "backgroundColor": "#0000FF" }}></span>Domestic</div>
          <div><span style={{ "backgroundColor": "#32CD32" }}></span>Environmental</div>
          <div><span style={{ "backgroundColor": "#FF4500" }}></span>Fire</div>
          <div><span style={{ "backgroundColor": "#9370DB" }}></span>Fish</div>
          <div><span style={{ "backgroundColor": "#00FFFF" }}></span>Flood Control</div>
          <div><span style={{ "backgroundColor": "#FF69B4" }}></span>Heating and Cooling</div>
          <div><span style={{ "backgroundColor": "#800080" }}></span>Industrial</div>
          <div><span style={{ "backgroundColor": "#00BFFF" }}></span>Instream Flow</div>
          <div><span style={{ "backgroundColor": "#FFD700" }}></span>Livestock</div>
          <div><span style={{ "backgroundColor": "#A52A2A" }}></span>Mining</div>
          <div><span style={{ "backgroundColor": "#4B0082" }}></span>Municipal</div>
          <div><span style={{ "backgroundColor": "#808080" }}></span>Other</div>
          <div><span style={{ "backgroundColor": "#FFA500" }}></span>Power</div>
          <div><span style={{ "backgroundColor": "#D2691E" }}></span>Recharge</div>
          <div><span style={{ "backgroundColor": "#FFC0CB" }}></span>Recreation</div>
          <div><span style={{ "backgroundColor": "#F0FFF0" }}></span>Snow Making</div>
          <div><span style={{ "backgroundColor": "#F5DEB3" }}></span>Storage</div>
          <div><span style={{ "backgroundColor": "#D3D3D3" }}></span>Unspecified</div>
          <div><span style={{ "backgroundColor": "#FF0000" }}></span>Wildlife</div>
        </div>
      </div>
      <div id="map" className="map h-100"></div>
    </div>
  );
}

export default Map;
