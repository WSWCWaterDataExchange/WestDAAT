import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import moment from 'moment';
import DateSelect from './DateSelect';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import './AggregationMap.css';

mapboxgl.accessToken =
  'pk.eyJ1IjoiYW1hYmRhbGxhaCIsImEiOiJjazJnbno5ZHIwazVqM21xZzMwaWpsc2hqIn0.j6BmkJdp5O_9ITGm4Gwe0w';

const waterSourceTypes = ["Effluent", "Groundwater", "Lost", "Other", "Recharge", "Reservoir / Storage", "Surface and Groundwater", "Surface Water", "Unspecified"];
const beneficialUses = ["Agricultural", "Aquaculture", "Commercial", "Domestic", "Environmental", "Fire", "Fish", "Flood Control", "Heating", "Heating and Cooling", "Industrial", "Instream Flow", "Livestock", "Mining", "Municipal", "Other", "Power", "Recharge", "Recreation", "Snow Making", "Storage", "Unspecified", "Wildlife"];
const variableTypes = ["Consumptive Use", "Demand", "Supply", "Withdrawal"];

const dataSelectionTypes = ["Counties", "Basin", "DAUCO", "HUC8", "HR"];

const AggregationMap = () => {
  const mapContainerRef = useRef(null);

  // Data
  const [aggregateData, setAggregateData] = React.useState([]);
  const [timeSeriesData, setTimeSeriesData] = React.useState([]);
  const [highChartsData, setHighChartsData] = React.useState({});

  // Filters
  const [dateFilter, setDateFilter] = React.useState([moment().year().valueOf()]);
  const [variableTypeFilter, setVariableTypeFilter] = React.useState("Withdrawal");
  const [beneficialUseFilter, setBeneficialUseFilter] = React.useState("Agricultural");
  const [waterSourceTypeFilter, setWaterSourceTypeFilter] = React.useState("Groundwater");

  // Data selection
  const [dataSelection, setDataSelection] = React.useState("Counties");

  // Re-Apply Filter On Change
  useEffect(() => {
    applyFilters();
  }, [dateFilter, variableTypeFilter, beneficialUseFilter, waterSourceTypeFilter]);

  // Load Highcharts Data
  useEffect(() => {
    loadHighChartsData();
  }, [timeSeriesData]);

  // Initialize Map / Render New Data
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
  }, [aggregateData, dataSelection]);

  function loadData(map) {
    let data = aggregateData;
    let selection = dataSelection;
    let matchExpression = null;

    map.on('load', function () {
      map.addSource('WaDE_County', {
        type: 'vector',
        url: 'mapbox://amabdallah.3n378lz8'
      });

      map.addSource('WaDE_CustomBasin', {
        type: 'vector',
        url: 'mapbox://amabdallah.0oieb16i'
      });

      map.addSource('WaDE_DAUCO', {
        type: 'vector',
        url: 'mapbox://amabdallah.5493exu9'
      });

      map.addSource('WaDE_HUC8', {
        type: 'vector',
        url: 'mapbox://amabdallah.9liel9wd'
      });

      map.addSource('WaDE_HR', {
        type: 'vector',
        url: 'mapbox://amabdallah.9tzwqsd3'
      });

      // Build Match Expression for Color Interpolation
      if (typeof data.aggregationData != 'undefined' && typeof data.aggregationData[0] != 'undefined') {
        var matchExpression = ['match', ['get', 'UnitUUID']];

        data.aggregationData.forEach((agg) => {
          matchExpression.push(agg.reportingUnit.reportingUnitUuid, generateColor(data.minimumAmount, data.maximumAmount, agg.amount));
        });

        matchExpression.push('rgba(128, 128, 128, 0.25)');
      }

      loadShapeFile(map, selection, matchExpression);
    });
  };

  function loadShapeFile(map, selection, matchExpression) {
    var fillColor = matchExpression || 'rgb(128, 128, 128)';
    var layer = {
      'id': 'rendered-shapes',
      'type': 'fill',
      'source': '',
      'source-layer': '',
      'paint': {
        'fill-color': fillColor,
        'fill-opacity': 0.75,
        'fill-outline-color': '#fff'
      }
    };

    switch (selection) {
      case "Counties":
        layer['source'] = 'WaDE_County'
        layer['source-layer'] = 'WaDE_County-4nxlg1';
        break;
      case "Basin":
        layer['source'] = 'WaDE_CustomBasin';
        layer['source-layer'] = 'CustomBasin';
        break;
      case "DAUCO":
        layer['source'] = 'WaDE_DAUCO';
        layer['source-layer'] = 'WaDE_CustomBasin3_DAUCO-01d4fk';
        break;
      case "HUC8":
        layer['source'] = 'WaDE_HUC8';
        layer['source-layer'] = 'WaDE_HUC8';
        break;
      case "HR":
        layer['source'] = 'WaDE_HR';
        layer['source-layer'] = 'WaDE_CustomBasin2_HR';
        break;
    }

    map.addLayer(layer);
  };

  function loadPolygonOnClick(map) {
    map.on('click', function (e) {
      let feature = map.queryRenderedFeatures(e.point, ['rendered-shapes'])[0];

      if (typeof (feature) !== 'undefined') {
        fetchTimeSeriesData(feature.properties);

        var coordinates = getPolygonCentroid(feature.geometry.coordinates[0]);

        if (!isNaN(coordinates[0])) {
          var description = "<div style=\"padding-right:15px;\"><b>UUID: " + feature.properties.UnitUUID + "</b><div>Name: " + feature.properties.Name + "</div><div>State: " + feature.properties.StateCV + "</div></div>";

          new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(description)
            .addTo(map);
        }
      }
    });
  };

  function loadHighChartsData() {
    var data = timeSeriesData || [];

    if (data.length == 0) {
      return;
    }

    var reportingUnitName = data[0].reportingUnit.reportingUnitName;
    var reportingUnitUuid = data[0].reportingUnit.reportingUnitUuid;

    var variableType = variableTypeFilter;
    var beneficialUse = beneficialUseFilter;
    var waterSourceType = waterSourceTypeFilter;

    var renderedData = data.map(agg => {
      return [parseInt(agg.reportYearCv), agg.amount]
    });

    var highChartsData = {
      chart: {
        type: 'line'
      },
      title: {
        text: variableType + ' Volume (Acre-Feet) For ' + reportingUnitName + " (" + reportingUnitUuid + ") " + waterSourceType + " for use in " + beneficialUse
      },
      xAxis: {
        title: {
          text: 'Year'
        }
      },
      yAxis: {
        title: {
          text: 'Acre-Feet'
        }
      },
      legend: {
        enabled: false
      },
      series: [
        {
          "data": renderedData,
          "name": "Acre-Feet / Year"
        }
      ]
    };

    setHighChartsData(highChartsData);
  };

  function generateColor(min, max, aggAmount) {
    var mid = (min + max) / 2;

    if (aggAmount > mid) {
      var scale = 255 / (max - min);
      var value = 255 - (scale * aggAmount);
      return ('rgb(0, 0, ' + value + ')');
    } else if (aggAmount == mid) {
      return ('rgb(0, 0, 255)');
    } else if (aggAmount === 0) {
      return ('rgba(128, 128, 128, 0.25)')
    } else {
      var scale = 255 / (max - min);
      var value = 255 - (scale * aggAmount);
      return ('rgb(' + value + ', ' + value + ', 255)');
    }
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
  };

  function filterVariableType(e) {
    setVariableTypeFilter(e.target.value);
  };

  function filterBeneficialUse(e) {
    setBeneficialUseFilter(e.target.value);
  };

  function filterWaterSourceType(e) {
    setWaterSourceTypeFilter(e.target.value);
  };

  async function changeDataSelection(e) {
    setDataSelection(e.target.value);
  };

  async function applyFilters() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("x-functions-key", "gbPgxR/Femue08YsLtEnmpAukABhpT26AxBPO6wavTkczFFoYJgdSA==");

    var raw = JSON.stringify({
      ReportingUnitUuid: "",
      ReportYearCv: dateFilter[0].toString(),
      BeneficialUseCv: beneficialUseFilter,
      VariableCv: variableTypeFilter,
      WaterSourceTypeCV: waterSourceTypeFilter,
      ReportingUnitTypeCv: ""
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    // await fetch("http://localhost:7071/api/GetWaterAggregationByFilterValues", requestOptions)
    await fetch("https://mapboxprototypeapi.azurewebsites.net/api/GetWaterAggregationByFilterValues", requestOptions)
      .then(response => response.text())
      .then(result => {
        console.log(JSON.parse(result));
        setAggregateData(JSON.parse(result));
      })
      .catch(error => console.log('error', error));
  };

  async function fetchTimeSeriesData(features) {
    if (features.UnitUUID) {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("x-functions-key", "gbPgxR/Femue08YsLtEnmpAukABhpT26AxBPO6wavTkczFFoYJgdSA==");

      var raw = JSON.stringify({
        ReportingUnitUuid: features.UnitUUID,
        ReportYearCv: "",
        BeneficialUseCv: beneficialUseFilter,
        VariableCv: variableTypeFilter,
        WaterSourceTypeCV: waterSourceTypeFilter,
        ReportingUnitTypeCv: ""
      });

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

      // await fetch("http://localhost:7071/api/GetWaterAggregationTimeSeries", requestOptions)
      await fetch("https://mapboxprototypeapi.azurewebsites.net/api/GetWaterAggregationTimeSeries", requestOptions)
        .then(response => response.text())
        .then(result => {
          var data;
          data = JSON.parse(result);
          data = data.sort((a, b) => a.reportYearCv.localeCompare(b.reportYearCv));
          setTimeSeriesData(data);
        })
        .catch(error => console.log('error', error));
    }
  };

  return (
    <div className="map-content">
      {/* Filters */}
      <div className="row p-4">
        <div className="p-4 w-100">
          <div className="form-group w-100">
            <label>Select Data Source</label>
            <select className="form-control" value={dataSelection} onChange={changeDataSelection}>
              {dataSelectionTypes.map((type) => (
                <option value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div className="form-group w-100">
            <label>Select Variable Type</label>
            <select className="form-control" value={variableTypeFilter} onChange={filterVariableType}>
              {variableTypes.map((variableType) => (
                <option value={variableType}>{variableType}</option>
              ))}
            </select>
          </div>
          <div className="form-group w-100">
            <label>Select Beneficial Use</label>
            <select className="form-control" value={beneficialUseFilter} onChange={filterBeneficialUse}>
              {beneficialUses.map((beneficialUse) => (
                <option value={beneficialUse}>{beneficialUse}</option>
              ))}
            </select>
          </div>
          <div className="form-group w-100">
            <label>Select Water Source Type</label>
            <select className="form-control" value={waterSourceTypeFilter} onChange={filterWaterSourceType}>
              {waterSourceTypes.map((waterSource) => (
                <option value={waterSource}>{waterSource}</option>
              ))}
            </select>
          </div>
          <div className="form-group w-100">
            <label>Select Date</label>
            <DateSelect filterDateRange={setDateFilter} />
          </div>
        </div>
      </div>
      {/* Map */}
      <div className="row min-vh-75">
        <div className="col-md-12">
          {
            aggregateData.maximumAmount > 0 &&
            <div className='legend'>
              <div>
                <p>Volume (AF)</p>
                <div className="row">
                  <div className="col-sm-12">
                    {/* <div className="align-text-top text-center">{aggregateData.maximumAmount}</div> */}
                    <div className="align-text-top text-center">{aggregateData.maximumAmount.toLocaleString('en-US', { maximumFractionDigits: 2 })}</div>
                    <div className="legend-gradient" />
                    {/* <div className="align-text-bottom text-center">{aggregateData.minimumAmount}</div> */}
                    <div className="align-text-bottom text-center">{aggregateData.minimumAmount.toLocaleString('en-US', { maximumFractionDigits: 2 })}</div>
                  </div>
                </div>
              </div>
            </div>
          }
          <div className='map-container' ref={mapContainerRef} />
        </div >
      </div >
      {/* Data */}
      <div className="row min-vh-25 table-container">
        <div className="w-100 p-4 align-center">
          {
            timeSeriesData.length > 0 &&
            <HighchartsReact highcharts={Highcharts} options={highChartsData} />
          }
        </div>
      </div>
    </div >
  );
};

export default AggregationMap;
