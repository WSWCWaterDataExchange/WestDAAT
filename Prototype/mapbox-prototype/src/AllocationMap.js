import React, { useRef, useEffect } from 'react';
import ReactDOM from "react-dom";
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import DropdownMultiselect from "react-multiselect-dropdown-bootstrap"; // https://www.npmjs.com/package/react-multiselect-dropdown-bootstrap
import moment from 'moment';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import PieChart from "highcharts-react-official";
import DateRangeSelect from './DateRangeSelect';
import * as turf from '@turf/turf';
import './AllocationMap.css';

Highcharts.setOptions({
  lang: {
    thousandsSep: ','
  }
})

mapboxgl.accessToken = 'pk.eyJ1IjoiYW1hYmRhbGxhaCIsImEiOiJjazJnbno5ZHIwazVqM21xZzMwaWpsc2hqIn0.j6BmkJdp5O_9ITGm4Gwe0w';

const layers = { layers: ['agricultural', 'aquaculture', 'commercial', 'domestic', 'environmental', 'fire', 'fish', 'flood', 'heating', 'industrial', 'instream', 'livestock', 'mining', 'municipal', 'other', 'power', 'recharge', 'recreation', 'snow', 'storage', 'unspecified', 'wildlife'] }
const colorMap = [{ name: 'Agricultural', color: '#006400' },
{ name: 'Aquaculture', color: '#9ACD32' },
{ name: 'Commercial', color: '#FF00E6' },
{ name: 'Domestic', color: '#0000FF' },
{ name: 'Environmental', color: '#32CD32' },
{ name: 'Fire', color: '#FF4500' },
{ name: 'Fish', color: '#9370DB' },
{ name: 'Flood Control', color: '#00FFFF' },
{ name: 'Heating and Cooling', color: '#FF69B4' },
{ name: 'Industrial', color: '#800080' },
{ name: 'Instream Flow', color: '#00BFFF' },
{ name: 'Livestock', color: '#FFD700' },
{ name: 'Mining', color: '#A52A2A' },
{ name: 'Municipal', color: '#4B0082' },
{ name: 'Other', color: '#808080' },
{ name: 'Power', color: '#FFA500' },
{ name: 'Recharge', color: '#D2691E' },
{ name: 'Recreation', color: '#FFC0CB' },
{ name: 'Snow Making', color: '#F0FFF0' },
{ name: 'Storage', color: '#F5DEB3' },
{ name: 'Unspecified', color: '#D3D3D3' },
{ name: 'Wildlife', color: '#FF0000' }];

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
  { key: 'unspecified', label: 'Unspecified' },
  { key: 'wildlife', label: 'Wildlife' },
]
const riverBasins = [
  { key: 'Bear River Basin', label: 'Bear River Basin' },
  { key: 'Colorado River Basin', label: 'Colorado River Basin' },
  { key: 'Columbia River Basin', label: 'Columbia River Basin' },
  { key: 'Rio Grande River Basin', label: 'Grande River Basin' },
  { key: 'Missouri River Basin', label: 'Missouri River Basin' },
  { key: 'Klamath River Basin', label: 'Klamath River Basin' },
  { key: 'Sacramento - San Joaquin River Basin', label: 'Sacramento - San Joaquin River Basin' },
  { key: 'Truckee - Carson River Basin', label: 'Truckee - Carson River Basin' },
  { key: 'Arkansas River Basin', label: 'Arkansas River Basin' },
  { key: 'Pecos River Basin', label: 'Pecos River Basin' }
]
const waterSourceTypes = [
  { key: 'Groundwater', label: 'Groundwater' },
  { key: 'Other', label: 'Other' },
  // 'Hidden' at client request
  // { key: 'Reservoir / Storage', label: 'Reservoir / Storage' },
  // { key: 'Surface and Groundwater', label: 'Surface and Groundwater' },
  { key: 'Surface Water', label: 'Surface Water' },
  { key: 'Unspecified', label: 'Unspecified' }
]
const ownerClassifications = [
  { key: 'Army (USA)', label: 'Army (USA)' },
  { key: 'Bureau of Indian Affairs (USBIA)', label: 'Bureau of Indian Affairs (USBIA)' },
  { key: 'Bureau of Land Management (USBLM)', label: 'Bureau of Land Management (USBLM)' },
  { key: 'Bureau Reclamation (USBR)', label: 'Bureau Reclamation (USBR)' },
  { key: 'City', label: 'City' },
  { key: 'Coast Guard (USCG)', label: 'Coast Guard (USCG)' },
  { key: 'Commercial', label: 'Commercial' },
  { key: 'Customs and Border Patrol (USCBP)', label: 'Customs and Border Patrol (USCBP)' },
  { key: 'Department of Agriculture (USDA)', label: 'Department of Agriculture (USDA)' },
  { key: 'Department of Defense (USDOD)', label: 'Department of Defense (USDOD)' },
  { key: 'Department of Energy (USDOE)', label: 'Department of Energy (USDOE)' },
  { key: 'Department of Homeland Security (USDHS)', label: 'Department of Homeland Security (USDHS)' },
  { key: 'Department of Housing and Urban Development (USHUD)', label: 'Department of Housing and Urban Development (USHUD)' },
  { key: 'Department of Justice (USDOJ)', label: 'Department of Justice (USDOJ)' },
  { key: 'Department of the Interior (USDI)', label: 'Department of the Interior (USDI)' },
  { key: 'Department of Transportation (USDOT)', label: 'Department of Transportation (USDOT)' },
  { key: 'Department of Veterans Affairs (USVA)', label: 'Department of Veterans Affairs (USVA)' },
  { key: 'Environmental Protection Agency (USEPA)', label: 'Environmental Protection Agency (USEPA)' },
  { key: 'Federal Aviation Administration (USFAA)', label: 'Federal Aviation Administration (USFAA)' },
  { key: 'Fish and Wildlife Service (USFWS)', label: 'Fish and Wildlife Service (USFWS)' },
  { key: 'Forest Service (USFS)', label: 'Forest Service (USFS)' },
  { key: 'General Services Administration (USGSA)', label: 'General Services Administration (USGSA)' },
  { key: 'Geological Survey (USGS)', label: 'Geological Survey (USGS)' },
  { key: 'In Review', label: 'In Review' },
  { key: 'Indian Health Service (USIHS)', label: 'Indian Health Service (USIHS)' },
  { key: 'Institution', label: 'Institution' },
  { key: 'Marine Corps (USMC)', label: 'Marine Corps (USMC)' },
  { key: 'National Geodetic Survey (USNGS)', label: 'National Geodetic Survey (USNGS)' },
  { key: 'National Park Service (USNPS)', label: 'National Park Service (USNPS)' },
  { key: 'Native American', label: 'Native American' },
  { key: 'Navy (USN)', label: 'Navy (USN)' },
  { key: 'State', label: 'State' },
  { key: 'Trust', label: 'Trust' },
  { key: 'United States Air Force (USAF)', label: 'United States Air Force (USAF)' },
  { key: 'United States of America', label: 'United States of America' },
  { key: 'United States Postal Service (USPS)', label: 'United States Postal Service (USPS)' },
  { key: 'Unspecified', label: 'Unspecified' }
]


const AllocationMap = () => {
  // Map Data
  const mapContainerRef = useRef(null);
  const [mapData, setMapData] = React.useState(null);

  // Allocation Data
  const [allocationData, setAllocationData] = React.useState([]);

  // Filter Data
  const [beneficialUseFilter, setBeneficialUseFilter] = React.useState(null);
  const [waterSourceFilter, setWaterSourceFilter] = React.useState(null);
  const [allocationOwnerFilter, setAllocationOwnerFilter] = React.useState(null);
  const [allocationOwnerClassificationFilter, setAllocationOwnerClassificationFilter] = React.useState(null);
  const [dateRangeFilter, setDateRangeFilter] = React.useState(null);
  const [riverBasinFilter, setRiverBasinFilter] = React.useState(null);

  const [waterSourceFilterRaw, setWaterSourceFilterRaw] = React.useState(null);
  const [allocationOwnerFilterRaw, setAllocationOwnerFilterRaw] = React.useState(null);
  const [allocationOwnerClassificationFilterRaw, setAllocationOwnerClassificationFilterRaw] = React.useState(null);
  const [dateRangeFilterRaw, setDateRangeFilterRaw] = React.useState(null);
  const [riverBasinFilterRaw, setRiverBasinFilterRaw] = React.useState(null);

  // Rendered Feature Data
  const [highChartsAllocationTypeCount, setHighChartsAllocationTypeCount] = React.useState(null);
  const [highChartsAllocationFlowCfs, setHighChartsAllocationFlowCfs] = React.useState(null);
  const [highChartsAllocationVolumeAf, setHighChartsAllocationVolumeAf] = React.useState(null);

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

  useEffect(() => {
    fetchAllocationMetaData(beneficialUseFilter, waterSourceFilterRaw, allocationOwnerFilterRaw, allocationOwnerClassificationFilterRaw, dateRangeFilterRaw, riverBasinFilterRaw);
  }, [beneficialUseFilter, waterSourceFilterRaw, allocationOwnerFilterRaw, allocationOwnerClassificationFilterRaw, dateRangeFilterRaw, riverBasinFilterRaw]);

  function loadData(map) {
    setMapData(map);

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

  function sortHighChartsData(data) {
    var mergeData = (d, c) => d.map(i => ({
      val: i,
      color: c.find((c) => c.name === i.name)
    }))

    let list = mergeData(data, colorMap);

    list.sort(function (a, b) {
      return ((a.val.y < b.val.y) ? -1 : ((a.val.y == b.val.y) ? 0 : 1));
    });

    let colors = [];
    for (var k = 0; k < list.length; k++) {
      data[k] = list[k].val;
      colors[k] = list[k].color.color;
    }

    return {
      data,
      colors
    }
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
      fetchAllocationData(getPolygonMapIntersect(map, e.features[0]).slice(2));
    });

    map.on('draw.update', function (e) {
      fetchAllocationData(getPolygonMapIntersect(map, e.features[0]).slice(2));
    });

    map.on('draw.delete', function (e) {
      fetchAllocationData();
    });
  }

  function loadPointSelection(map) {
    layers.layers.forEach(e => {
      map.on('mousemove', e, (x) => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', e, (x) => {
        map.getCanvas().style.cursor = '';
      });
    });

    map.on('click', function (e) {
      let features = map.queryRenderedFeatures(e.point, layers);
      if (features.length) {
        var feature = features[0]; //topmost feature
        fetchAllocationData([feature.properties.allocationId]);

        var coordinates = feature.geometry.coordinates.slice();

        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        if (coordinates[0].constructor === Array) {
          coordinates = coordinates[0];
        }

        var container = document.createElement('div');

        var jsx = <div>
          <b>{feature.properties.siteUuid}</b>
          <div>{feature.properties.ownerClassification}</div>
          <div>{feature.properties.beneficialUseCV}</div>
          <div>{feature.properties.waterSourceType}</div>
          <div>{moment(feature.properties.priorityDate).format('DD-MMM-YYYY')}</div>
          <button type='button' class='btn btn-primary mt-2' onClick={() => openAllocationDetails(feature.properties.siteUuid)}>See Details</button>
        </div>

        var description = ReactDOM.render(jsx, container);

        new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setDOMContent(description)
          .addTo(map);
      }
    });
  }

  function openAllocationDetails(id) {
    const win = window.open("/details/" + id, "_blank");
    win.focus();
  }

  function toggleLayers(activeLayerArray) {
    setBeneficialUseFilter(activeLayerArray);

    let layerArray = layers.layers;
    let map = mapData

    layerArray.map(layerName => map.setLayoutProperty(layerName, 'visibility', 'none'));
    activeLayerArray.map(layerName => map.setLayoutProperty(layerName, 'visibility', 'visible'));
  }

  function renderRiverBasins(basins) {
    let map = mapData;

    // Remove old layers
    riverBasins.map(basin => {
      if (map.getLayer(basin.key)) {
        map.removeLayer(basin.key);
      }
      if (map.getSource(basin.key)) {
        map.removeSource(basin.key);
      }
    });

    // Get bottom layer
    var renderedLayers = map.getStyle().layers;
    var bottomCircleLayerId;
    for (var i = 0; i < renderedLayers.length; i++) {
      if (renderedLayers[i].type === 'circle') {
        bottomCircleLayerId = renderedLayers[i].id;
        break;
      }
    }

    var intersectFilter = ['in', 'allocationId'];

    basins.map(basin => {
      map.addSource(basin.properties.basinName, {
        'type': 'geojson',
        'data': basin
      });

      map.addLayer({
        'id': basin.properties.basinName,
        'type': 'fill',
        'source': basin.properties.basinName,
        'layout': {},
        'paint': {
          'fill-color': '#088',
          'fill-opacity': 0.4
        }
      }, bottomCircleLayerId);

      getPolygonMapIntersect(map, basin).slice(2).map(allocationId => intersectFilter.push(allocationId));
    });

    var allocationFilter;
    if (intersectFilter.length > 2) {
      allocationFilter = [
        "all",
        intersectFilter
      ];
    } else {
      allocationFilter = ["all"];
    }

    setRiverBasinFilter(intersectFilter);

    if (dateRangeFilter !== null) {
      allocationFilter.push(dateRangeFilter);
    }

    if (waterSourceFilter !== null) {
      allocationFilter.push(waterSourceFilter);
    }

    if (allocationOwnerFilter !== null) {
      allocationFilter.push(allocationOwnerFilter);
    }

    layers.layers.forEach((item) => {
      map.setFilter(item, allocationFilter);
    });
  }

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
    }, ['in', 'allocationId']);

    return filter;
  }

  function filterRiverBasins(basinNames) {
    let map = mapData;
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("x-functions-key", "gbPgxR/Femue08YsLtEnmpAukABhpT26AxBPO6wavTkczFFoYJgdSA==");

    setRiverBasinFilterRaw(basinNames);

    var raw = JSON.stringify(basinNames);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    // fetch("http://localhost:7071/api/GetBasinPolygonByNames", requestOptions)
    fetch("https://mapboxprototypeapi.azurewebsites.net/api/GetBasinPolygonByNames", requestOptions)
      .then(response => response.text())
      .then(result => {
        layers.layers.forEach((item) => {
          map.setFilter(item, ["all"]);
        });
        setTimeout(() => { renderRiverBasins(JSON.parse(result)); }, 100);
      })
      .catch(error => console.log('error', error));
  }

  function filterDateRange(dateRange) {
    if (dateRange == null || mapData == null) {
      return;
    }

    setDateRangeFilterRaw(dateRange);

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

    if (riverBasinFilter !== null) {
      allocationFilter.push(riverBasinFilter);
    }

    if (allocationOwnerClassificationFilter !== null) {
      allocationFilter.push(allocationOwnerClassificationFilter);
    }

    layers.layers.forEach((item) => {
      map.setFilter(item, allocationFilter);
    });
  }

  function filterWaterSource(sourceArr) {
    var map = mapData;
    var filterValue = sourceArr;

    setWaterSourceFilterRaw(sourceArr);

    var allocationFilter;
    if (filterValue.length > 0) {
      allocationFilter = [
        "all",
        ["in", "waterSourceType"]
      ];
      sourceArr.map(source => {
        allocationFilter[1].push(source);
      });
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

    if (riverBasinFilter !== null) {
      allocationFilter.push(riverBasinFilter);
    }

    if (allocationOwnerClassificationFilter !== null) {
      allocationFilter.push(allocationOwnerClassificationFilter);
    }

    layers.layers.forEach((item) => {
      map.setFilter(item, allocationFilter);
    });
  }

  function filterAllocationOwnerClassification(sourceArr) {
    var map = mapData;
    var filterValue = sourceArr;

    setAllocationOwnerClassificationFilterRaw(sourceArr)

    var allocationFilter;
    if (filterValue.length > 0) {
      allocationFilter = [
        "all",
        ["in", "ownerClassification"]
      ];
      sourceArr.map(source => {
        allocationFilter[1].push(source);
      });
    } else {
      allocationFilter = ["all"];
    }

    setAllocationOwnerClassificationFilter(allocationFilter);

    if (dateRangeFilter !== null) {
      allocationFilter.push(dateRangeFilter);
    }

    if (waterSourceFilter !== null) {
      allocationFilter.push(waterSourceFilter);
    }

    if (allocationOwnerFilter !== null) {
      allocationFilter.push(allocationOwnerFilter);
    }

    if (riverBasinFilter !== null) {
      allocationFilter.push(riverBasinFilter);
    }

    layers.layers.forEach((item) => {
      map.setFilter(item, allocationFilter);
    });
  }

  function filterAllocationOwner(e) {
    var map = mapData;
    var filterValue = e.target.value;

    setAllocationOwnerFilterRaw(filterValue);

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

    if (riverBasinFilter !== null) {
      allocationFilter.push(riverBasinFilter);
    }

    if (allocationOwnerClassificationFilter !== null) {
      allocationFilter.push(allocationOwnerClassificationFilter);
    }

    layers.layers.forEach((item) => {
      map.setFilter(item, allocationFilter);
    });
  }

  function fetchAllocationData(allocationArr) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("x-functions-key", "gbPgxR/Femue08YsLtEnmpAukABhpT26AxBPO6wavTkczFFoYJgdSA==");

    var raw = JSON.stringify(allocationArr);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    // fetch("http://localhost:7071/api/GetWaterAllocationData", requestOptions)
    fetch("https://mapboxprototypeapi.azurewebsites.net/api/GetWaterAllocationData", requestOptions)
      .then(response => response.text())
      .then(result => {
        setAllocationData(JSON.parse(result));
      })
      .catch(error => console.log('error', error));
  }

  function fetchAllocationMetaData(beneficialUseFilter, waterSourceFilter, allocationOwnerFilter, allocationOwnerClassificationFilter, dateRangeFilter, riverBasinFilter) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("x-functions-key", "gbPgxR/Femue08YsLtEnmpAukABhpT26AxBPO6wavTkczFFoYJgdSA==");

    if (beneficialUseFilter !== null) {
      beneficialUseFilter = beneficialUseFilter.map(w => w.charAt(0).toUpperCase() + w.substring(1))
    }

    var startDate, endDate;
    if (dateRangeFilter !== null) {
      startDate = moment(dateRangeFilter[0]).format();
      endDate = moment(dateRangeFilter[1]).format();
    } else {
      startDate = moment(new Date('1850/01/01')).format();
      endDate = moment().format();
    }

    var raw = JSON.stringify({
      BeneficialUses: beneficialUseFilter ?? [],
      WaterSourceType: waterSourceFilter ?? [],
      AllocationOwnerClassification: allocationOwnerClassificationFilter ?? [],
      AllocationOwner: allocationOwnerFilter ?? "",
      BasinNames: riverBasinFilter ?? [],
      StartDate: startDate,
      EndDate: endDate
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    // fetch("http://localhost:7071/api/GetWaterAllocationsMetaData", requestOptions)
    fetch("https://mapboxprototypeapi.azurewebsites.net/api/GetWaterAllocationsMetaData", requestOptions)
      .then(response => response.text())
      .then(result => {
        let metadata = JSON.parse(result);

        var sortedTypeCount = sortHighChartsData(metadata.map(x => ({ name: x.beneficialUse, y: x.count })));
        var sortedFlowCfs = sortHighChartsData(metadata.map(x => ({ name: x.beneficialUse, y: x.flow })));
        var sortedVolumeAf = sortHighChartsData(metadata.map(x => ({ name: x.beneficialUse, y: x.volume })));

        var sortedTypeCountTotal;
        var sortedFlowCfsTotal;
        var sortedVolumeAfTotal;

        setHighChartsAllocationTypeCount({
          chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie',
            events: {
              render: function (event) {
                var total = this.series[0].data[0].total.toLocaleString('en-US', { maximumFractionDigits: 0 });
                if (typeof (sortedTypeCountTotal) != "undefined") {
                  sortedTypeCountTotal.element.remove();
                }
                sortedTypeCountTotal = this.renderer
                  .text(
                    'Total: ' + total,
                    this.plotLeft,
                    this.plotTop,
                  )
                  .css({
                    color: '#ff0000',
                  })
                  .attr({
                    zIndex: 5,
                  }).add();
              }
            }
          },
          title: {
            text: 'Count of Rendered Beneficial Uses'
          },
          plotOptions: {
            pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              colors: sortedTypeCount.colors
            }
          },
          tooltip: {
            valueDecimals: 0,
            valueSuffix: '',
            pointFormat: '{point.y}',
            style: {
              fontSize: "16px"
            }
          },
          series: [
            {
              data: sortedTypeCount.data
            }
          ]
        });

        setHighChartsAllocationFlowCfs({
          chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie',
            events: {
              render: function (event) {
                var total = this.series[0].data[0].total.toLocaleString('en-US', { maximumFractionDigits: 0 });
                if (typeof (sortedFlowCfsTotal) != "undefined") {
                  sortedFlowCfsTotal.element.remove();
                }
                sortedFlowCfsTotal = this.renderer
                  .text(
                    'Total: ' + total + ' CFS',
                    this.plotLeft,
                    this.plotTop
                  )
                  .css({
                    color: '#ff0000',
                  })
                  .attr({
                    zIndex: 5
                  }).add()
              }
            }
          },
          title: {
            text: 'Cumulative Flow (CFS) of Rendered Allocations'
          },
          plotOptions: {
            pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              colors: sortedFlowCfs.colors
            }
          },
          tooltip: {
            valueDecimals: 2,
            valueSuffix: ' CFS',
            pointFormat: '{point.y}',
            style: {
              fontSize: "16px"
            }
          },
          series: [
            {
              data: sortedFlowCfs.data
            }
          ]
        });

        setHighChartsAllocationVolumeAf({
          chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie',
            events: {
              render: function (event) {
                var total = this.series[0].data[0].total.toLocaleString('en-US', { maximumFractionDigits: 0 });
                if (typeof (sortedVolumeAfTotal) != "undefined") {
                  sortedVolumeAfTotal.element.remove();
                }
                sortedVolumeAfTotal = this.renderer
                  .text(
                    'Total: ' + total + ' AF',
                    this.plotLeft,
                    this.plotTop
                  )
                  .css({
                    color: '#ff0000',
                  })
                  .attr({
                    zIndex: 5
                  }).add()
              }
            }
          },
          title: {
            text: 'Cumulative Volume (AF) of Rendered Allocations'
          },
          plotOptions: {
            pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              colors: sortedVolumeAf.colors,
            }
          },
          tooltip: {
            valueDecimals: 2,
            valueSuffix: ' AF',
            pointFormat: '{point.y}',
            style: {
              fontSize: "16px"
            }
          },
          series: [
            {
              data: sortedVolumeAf.data
            }
          ]
        });
      })
      .catch(error => console.log('error', error));
  }

  return (
    <div className="map-content">
      {/* Filters */}
      <div className="row p-4">
        <div className="p-4 w-100">
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
            <label>Filter by River Basin</label>
            <DropdownMultiselect
              options={riverBasins}
              handleOnChange={(selected) => filterRiverBasins(selected)}
              name="riverBasins"
            />
          </div>
          <div className="form-group">
            <label>Filter by Allocation Priority Date</label>
            <DateRangeSelect filterDateRange={filterDateRange} />
          </div>
          <div className="form-group">
            <label htmlFor="waterSourceFilterInput">Filter by Water Source Type</label>
            <DropdownMultiselect
              options={waterSourceTypes}
              selected={waterSourceTypes.map(x => x.key)}
              handleOnChange={(selected) => filterWaterSource(selected)}
              name="waterSource"
            />
          </div>
          <div className="form-group">
            <label htmlFor="ownerClassificationsFilterInput">Filter by Allocation Owner Classification</label>
            <DropdownMultiselect
              options={ownerClassifications}
              selected={ownerClassifications.map(x => x.key)}
              handleOnChange={(selected) => filterAllocationOwnerClassification(selected)}
              name="ownerClassification"
            />
          </div>
          {/* Hidden at client request */}
          {/* <div className="form-group">
            <label htmlFor="allocationOwnerFilterInput">Filter by Allocation Owner</label>
            <input className="form-control" id="allocationOwnerFilterInput" placeholder="Enter Allocation Owner" onChange={filterAllocationOwner} />
          </div> */}
        </div>
      </div>
      {/* Map & Legend */}
      <div className="row min-vh-75">
        <div className="col-md-12">
          <div className='legend'>
            <div>
              <h4>Feature Types</h4>
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
          <div className='map-container' ref={mapContainerRef} />
        </div >
      </div >
      { /* Charts */}
      <div className="row min-vh-25 table-container">
        <div className="col-sm-4 nopadding">
          <div className="w-100 align-center">
            {
              highChartsAllocationTypeCount &&
              <PieChart highcharts={Highcharts} options={highChartsAllocationTypeCount} />
            }
          </div>
        </div>
        <div className="col-sm-4 nopadding">
          <div className="w-100 align-center">
            {
              highChartsAllocationFlowCfs &&
              <PieChart highcharts={Highcharts} options={highChartsAllocationFlowCfs} />
            }
          </div>
        </div>
        <div className="col-sm-4 nopadding">
          <div className="w-100 align-center">
            {
              highChartsAllocationVolumeAf &&
              <PieChart highcharts={Highcharts} options={highChartsAllocationVolumeAf} />
            }
          </div>
        </div>
      </div>
      {/* Data */}
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

export default AllocationMap;
