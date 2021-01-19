import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import DropdownMultiselect from "react-multiselect-dropdown-bootstrap"; // https://www.npmjs.com/package/react-multiselect-dropdown-bootstrap
import * as turf from '@turf/turf';
import moment from 'moment';

import DateRangeSelect from './DateRangeSelect';

import './Map.css';

mapboxgl.accessToken =
  'pk.eyJ1IjoiYW1hYmRhbGxhaCIsImEiOiJjazJnbno5ZHIwazVqM21xZzMwaWpsc2hqIn0.j6BmkJdp5O_9ITGm4Gwe0w';

const layers = { layers: ['agricultural', 'aquaculture', 'commercial', 'domestic', 'environmental', 'fire', 'fish', 'flood', 'heating', 'industrial', 'instream', 'livestock', 'mining', 'municipal', 'other', 'power', 'recharge', 'recreation', 'snow', 'storage', 'unknown', 'wildlife'] }
const beneficialUses = [
  { key: 'agricultural', label: 'Agricultural' },
  { key: 'aquaculture', label: 'Aquaculture' },
  { key: 'commercial', label: 'Commercial' },
  { key: 'domestic', label: 'Domestic' },
  { key: 'environmental', label: 'Environmental' },
  { key: 'fire', label: 'Fire' },
  { key: 'fish', label: 'Fish' },
  { key: 'flood', label: 'Flood' },
  { key: 'heating', label: 'Heating' },
  { key: 'industrial', label: 'Industrial' },
  { key: 'instream', label: 'Instream' },
  { key: 'livestock', label: 'Livestock' },
  { key: 'mining', label: 'Mining' },
  { key: 'municipal', label: 'Municipal' },
  { key: 'other', label: 'Other' },
  { key: 'power', label: 'Power' },
  { key: 'recharge', label: 'Recharge' },
  { key: 'recreation', label: 'Recreation' },
  { key: 'snow', label: 'Snow' },
  { key: 'storage', label: 'Storage' },
  { key: 'unknown', label: 'Unknown' },
  { key: 'wildlife', label: 'Wildlife' },
]

const Map = () => {
  const mapContainerRef = useRef(null);
  const [allocationData, setAllocationData] = React.useState([]);
  const [mapData, setMapData] = React.useState(null);
  const [waterSourceFilter, setWaterSourceFilter] = React.useState(null);
  const [allocationOwnerFilter, setAllocationOwnerFilter] = React.useState(null);
  const [dateRangeFilter, setDateRangeFilter] = React.useState(null);

  useEffect(() => {
    let map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [-100, 40],
      zoom: 4
    });

    // Load Data
    loadData(map);

    // Load Interactions
    loadPolygonSelection(map);
    loadPointSelection(map);

    return () => map.remove();
  }, []);

  function loadData(map) {
    setMapData(map);

    map.on('load', function () {
      let circleRadius = {
        'base': 1.25,
        'stops': [
          [12, 2],
          [22, 180]
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
          'circle-color': '#FFFF00'
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
        'id': 'unknown',
        'source-layer': 'unknown',
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
    });
  }

  function loadPolygonSelection(map) {
    map.addControl(new MapboxDraw({
      displayControlsDefault: false,
      boxSelect: true,
      controls: {
        polygon: true,
        trash: true
      }
    }));

    map.on('draw.create', function (e) {
      fetchAllocationData(getPolygonMapIntersect(map, e.features[0]));
    });

    map.on('draw.update', function (e) {
      fetchAllocationData(getPolygonMapIntersect(map, e.features[0]));
    });

    map.on('draw.delete', function (e) {
      fetchAllocationData();
    });

    function getPolygonMapIntersect(map, userPolygon) {
      var polygonBoundingBox = turf.bbox(userPolygon);

      var southWest = [polygonBoundingBox[0], polygonBoundingBox[1]];
      var northEast = [polygonBoundingBox[2], polygonBoundingBox[3]];

      var northEastPointPixel = map.project(northEast);
      var southWestPointPixel = map.project(southWest);

      var features = map.queryRenderedFeatures([southWestPointPixel, northEastPointPixel], layers);

      var filter = features.reduce(function (memo, feature) {
        if (feature.geometry.coordinates[0].constructor === Array) {
          feature.geometry.coordinates = feature.geometry.coordinates[0];
        }

        if (turf.inside(feature, userPolygon)) {
          memo.push(feature.properties.allocationId);
        }
        return memo;
      }, ['in', 'id']);

      return filter.slice(2);
    }
  }

  function loadPointSelection(map) {
    map.on('click', function (e) {
      let features = map.queryRenderedFeatures(e.point, layers);
      if (features.length) {
        var feature = features[0]; //topmost feature
        fetchAllocationData([feature.properties.allocationId]);

        var coordinates = feature.geometry.coordinates.slice();
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        var description = "<div><h4>" + feature.properties.siteId + "</h4><div>" + feature.properties.beneficialUseCV + "</div><div>" + feature.properties.waterSourceType + "</div><div>" + moment(feature.properties.priorityDate).format('DD-MMM-YYYY') + "</div></div>"

        if (coordinates[0].constructor === Array) {
          coordinates = coordinates[0];
        }

        new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(description)
          .addTo(map);
      }
    });
  }

  function toggleLayers(activeLayerArray) {
    let layerArray = layers.layers;
    let map = mapData

    layerArray.map(layerName => map.setLayoutProperty(layerName, 'visibility', 'none'));
    activeLayerArray.map(layerName => map.setLayoutProperty(layerName, 'visibility', 'visible'));
  }

  function filterDateRange(dateRange) {
    if (dateRange == null || mapData == null) {
      return;
    }

    var map = mapData;
    var min = dateRange[0];
    var max = dateRange[1];

    var allocationFilter = [
      "all",
      [">=", "priorityDate", min],
      ["<=", "priorityDate", max]
    ];

    setDateRangeFilter(allocationFilter);

    if (allocationOwnerFilter !== null) {
      allocationFilter.push(allocationOwnerFilter);
    }

    if (waterSourceFilter !== null) {
      allocationFilter.push(waterSourceFilter);
    }

    layers.layers.forEach((item) => {
      map.setFilter(item, allocationFilter);
    });
  }

  function filterWaterSource(e) {
    var map = mapData;
    var filterValue = e.target.value;

    var allocationFilter;
    if (filterValue !== "") {
      allocationFilter = [
        "all",
        ["in", "waterSourceType", filterValue]
      ];
    } else {
      allocationFilter = ["all"];
    }

    setWaterSourceFilter(allocationFilter);

    if (dateRangeFilter !== null) {
      allocationFilter.push(dateRangeFilter);
    }

    if (allocationOwnerFilter !== null) {
      allocationFilter.push(allocationOwnerFilter);
    }

    layers.layers.forEach((item) => {
      map.setFilter(item, allocationFilter);
    });
  }

  function filterAllocationOwner(e) {
    var map = mapData;
    var filterValue = e.target.value;

    var allocationFilter;
    if (filterValue !== "") {
      allocationFilter = [
        "all",
        ["in", "allocationOwner", filterValue]
      ];
    } else {
      allocationFilter = ["all"];
    }

    setAllocationOwnerFilter(allocationFilter);

    if (dateRangeFilter !== null) {
      allocationFilter.push(dateRangeFilter);
    }

    if (waterSourceFilter !== null) {
      allocationFilter.push(waterSourceFilter);
    }

    layers.layers.forEach((item) => {
      map.setFilter(item, allocationFilter);
    });
  }

  function fetchAllocationData(allocationArr) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify(allocationArr);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("http://localhost:7071/api/GetWaterAllocationData", requestOptions)
      .then(response => response.text())
      .then(result => {
        setAllocationData(JSON.parse(result));
      })
      .catch(error => console.log('error', error));
  }

  return (
    <div className="container-fluid overflow-hidden">
      <div className="jumbotron jumbotron-fluid p-4">
        <h1 className="display-4">WSWC POD Water Allocation Map</h1>
        <p className="lead">A web tool used to summarize aggregated annual water use for a given area across the Western United States.</p>
        <div className="p-4">
          <div className="form-group">
            <label>Filter by Beneficial Use</label>
            <DropdownMultiselect
              options={beneficialUses}
              selected={layers.layers}
              handleOnChange={(selected) => toggleLayers(selected)}
              name="beneficialUses"
            />
          </div>
          <div className="form-group">
            <label>Filter by Allocation Priority Date</label>
            <DateRangeSelect filterDateRange={filterDateRange} />
          </div>
          <div className="form-group">
            <label htmlFor="allocationOwnerFilterInput">Filter by Allocation Owner</label>
            <input className="form-control" id="allocationOwnerFilterInput" placeholder="Enter Allocation Owner" onChange={filterAllocationOwner} />
          </div>
          <div className="form-group">
            <label htmlFor="waterSourceFilterInput">Filter by Water Source Type</label>
            <input className="form-control" id="waterSourceFilterInput" placeholder="Enter Water Source Type" onChange={filterWaterSource} />
          </div>
        </div>
      </div>
      <div className="row min-vh-75">
        <div className="col-md-12">
          <div className='legend'>
            <div>
              <h4>Feature Types</h4>
              <div><span style={{ "backgroundColor": "#006400" }}></span>Agricultural</div>
              <div><span style={{ "backgroundColor": "#9ACD32" }}></span>Aquaculture</div>
              <div><span style={{ "backgroundColor": "#FFFF00" }}></span>Commercial</div>
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
              <div><span style={{ "backgroundColor": "#D3D3D3" }}></span>Unknown</div>
              <div><span style={{ "backgroundColor": "#FF0000" }}></span>Wildlife</div>
            </div>
          </div>
          <div className='map-container' ref={mapContainerRef} />
        </div >
      </div >
      <div className="row min-vh-25 table-container">
        {
          allocationData.length > 0 &&
          <table className="table table-striped table-dark m-5">
            <thead>
              <tr>
                <th scope="col">Source ID</th>
                <th scope="col">Source Name</th>
                <th scope="col">Source Type</th>
                <th scope="col">Allocation Owner</th>
                <th scope="col">Allocation Expiration</th>
                <th scope="col">Beneficial Use</th>
                <th scope="col">Organization</th>
                <th scope="col">Organization Contact</th>
              </tr>
            </thead>
            <tbody>
              {allocationData.map((allocation) => (
                <>
                  <tr key={allocation.allocationId}>
                    <th scope="row">{allocation.waterSourceUUID}</th>
                    <td>{allocation.waterSourceName}</td>
                    <td>{allocation.waterSourceType}</td>
                    <td>{allocation.allocationOwner}</td>
                    <td>{allocation.allocationExpiration}</td>
                    <td>{allocation.beneficialUseCV}</td>
                    <td>{allocation.organizationName}</td>
                    <td>{allocation.organizationContactName}: {allocation.organizationContactEmail}</td>
                  </tr>
                </>
              ))}
            </tbody>
          </table>
        }
      </div>
    </div >
  );
};

export default Map;
