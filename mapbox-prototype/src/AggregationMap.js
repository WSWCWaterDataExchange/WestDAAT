import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import moment from 'moment';

import './AggregationMap.css';

mapboxgl.accessToken =
  'pk.eyJ1IjoiYW1hYmRhbGxhaCIsImEiOiJjazJnbno5ZHIwazVqM21xZzMwaWpsc2hqIn0.j6BmkJdp5O_9ITGm4Gwe0w';

const AggregationMap = () => {
  const mapContainerRef = useRef(null);
  const [mapData, setMapData] = React.useState(null);

  useEffect(() => {
    let map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [-100, 40],
      zoom: 4
    });

    // Load Data
    loadData(map);

    // Load Map Interactivity
    loadPolygonOnClick(map);

    return () => map.remove();
  }, []);

  function loadData(map) {
    setMapData(map);

    map.on('load', function () {
      map.addSource('county-data', {
        type: 'vector',
        url: 'mapbox://amabdallah.3cyxf07t'
      });

      map.addLayer({
        id: 'counties',
        type: 'fill',
        source: 'county-data',
        'source-layer': 'WaDE_Counties-2ql4dy',
        'paint': {
          'fill-color': '#088',
          'fill-opacity': 0.75,
          'fill-outline-color': '#fff'
        }
      });
    });
  }

  function loadPolygonOnClick(map) {
    map.on('click', function (e) {
      let features = map.queryRenderedFeatures(e.point, ['counties']);
      console.log(features);
      if (features.length) {
        var feature = features[0];
        var coordinates = getPolygonCentroid(feature.geometry.coordinates[0]);

        if (!isNaN(coordinates[0])) {
          var description = "<div><h4>" + feature.properties.Name + "</h4><div>" + feature.properties.UnitUUID + "</div><div>" + feature.properties.StateCV + "</div></div>";

          new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(description)
            .addTo(map);
        }
      }
    });
  }

  function getPolygonCentroid(arr) {
    var minX, maxX, minY, maxY;
    for (var i = 0; i < arr.length; i++) {
      minX = (arr[i][0] < minX || minX == null) ? arr[i][0] : minX;
      maxX = (arr[i][0] > maxX || maxX == null) ? arr[i][0] : maxX;
      minY = (arr[i][1] < minY || minY == null) ? arr[i][1] : minY;
      maxY = (arr[i][1] > maxY || maxY == null) ? arr[i][1] : maxY;
    }
    return [(minX + maxX) / 2, (minY + maxY) / 2];
  }

  return (
    <div className="map-content">
      <div className="row min-vh-75">
        <div className="col-md-12">
          <div className='map-container' ref={mapContainerRef} />
        </div >
      </div >
    </div >
  );
};

export default AggregationMap;
