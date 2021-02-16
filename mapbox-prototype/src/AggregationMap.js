import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import moment from 'moment';
import DateSelect from './DateSelect';
import './AggregationMap.css';

mapboxgl.accessToken =
  'pk.eyJ1IjoiYW1hYmRhbGxhaCIsImEiOiJjazJnbno5ZHIwazVqM21xZzMwaWpsc2hqIn0.j6BmkJdp5O_9ITGm4Gwe0w';

const beneficialUses = ["Agricultural", "Agricultural Consumptive Use", "Agriculture", "Commercial (self-supplied)", "Domestic (self-supplied)", "Domestic Use", "Exports/Imports", "Fish & Wildlife", "Indian", "Industrial", "Industrial (self-supplied)", "Industrial Use", "Instream Flow Requirements", "Irrigated Agriculture", "Irrigated agriculture_ground", "Irrigated agriculture_reuse", "Irrigated agriculture_surface", "Livestock", "Livestock (self-supplied)", "Livestock_ground", "Livestock_reuse", "Livestock_surface", "M & I", "Major and Minor Reservoirs", "Managed Wetlands", "Manufacturing_ground", "Manufacturing_reuse", "Manufacturing_surface", "Minerals", "Mining (self-supplied)", "Mining_ground", "Mining_reuse", "Mining_surface", "Municipal", "Municipal  Use", "Municipal/Industrial", "Municipal_ground", "Municipal_reuse", "Municipal_surface", "Power", "Power (self-supplied)", "Public Water Supply", "Required Delta Outflow", "Reservoir Evaporation", "Steam-Electric Power_ground", "Steam-Electric Power_reuse", "Steam-Electric Power_surface", "Stockpond", "Unspecified", "Urban", "Wild And Scenic River"];
const variableTypes = ["Consumptive Use", "Demand", "Supply", "Withdrawal"]

const AggregationMap = () => {
  const mapContainerRef = useRef(null);

  // Data
  const [aggregateData, setAggregateData] = React.useState([]);
  const [timeSeriesData, setTimeSeriesData] = React.useState([]);

  // Filters
  const [dateFilter, setDateFilter] = React.useState([moment().year().valueOf()]);
  const [variableTypeFilter, setVariableTypeFilter] = React.useState("Withdrawal");
  const [beneficialUseFilter, setBeneficialUseFilter] = React.useState("Irrigated Agriculture");

  useEffect(() => {
    applyFilters();
  }, [dateFilter, variableTypeFilter, beneficialUseFilter]);

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
  }, [aggregateData]);

  function loadData(map) {
    let data = aggregateData;

    console.log(data);

    map.on('load', function () {
      map.addSource('county-data', {
        type: 'vector',
        url: 'mapbox://amabdallah.3cyxf07t'
      });

      if (typeof data.aggregationData != 'undefined' && typeof data.aggregationData[0] != 'undefined') {
        // Build match expression to paint color
        var matchExpression = ['match', ['get', 'UnitUUID']];

        // Interpolate color range scalar function
        var colorScalar = generateColorInterpolation(data.minimumAmount, data.maximumAmount)

        // Calculate color values for each area based on 'amount'
        data.aggregationData.forEach((agg) => {
          matchExpression.push(agg.reportingUnit.reportingUnitUuid, 'rgb(0, 0, ' + colorScalar(agg.amount) + ')');
        });

        // Push default color
        matchExpression.push('rgb(128, 128, 128)');

        map.addLayer({
          id: 'counties',
          type: 'fill',
          source: 'county-data',
          'source-layer': 'WaDE_Counties-2ql4dy',
          'paint': {
            'fill-color': matchExpression,
            'fill-opacity': 0.75,
            'fill-outline-color': '#fff'
          }
        });
      } else {
        map.addLayer({
          id: 'counties',
          type: 'fill',
          source: 'county-data',
          'source-layer': 'WaDE_Counties-2ql4dy',
          'paint': {
            'fill-color': 'rgb(128, 128, 128)',
            'fill-opacity': 0.75,
            'fill-outline-color': '#fff'
          }
        });
      }
    });
  }

  function loadPolygonOnClick(map) {
    map.on('click', function (e) {
      let feature = map.queryRenderedFeatures(e.point, ['counties'])[0];

      fetchTimeSeriesData(feature.properties);

      var coordinates = getPolygonCentroid(feature.geometry.coordinates[0]);

      if (!isNaN(coordinates[0])) {
        var description = "<div><div>" + feature.properties.Name + "</div><div>" + feature.properties.UnitUUID + "</div><div>" + feature.properties.StateCV + "</div></div>";

        new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(description)
          .addTo(map);
      }
    });
  }

  function generateColorInterpolation(min, max) {
    var scale = 255 / (max - min);
    return function (x) {
      return 255 - (scale * x);
    };
  };

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

  function filterVariableType(e) {
    setVariableTypeFilter(e.target.value);
  }

  function filterBeneficialUse(e) {
    setBeneficialUseFilter(e.target.value);
  }

  async function applyFilters() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("x-functions-key", "gbPgxR/Femue08YsLtEnmpAukABhpT26AxBPO6wavTkczFFoYJgdSA==");

    var raw = JSON.stringify({
      ReportingUnitUuid: "",
      ReportYearCv: dateFilter[0].toString(),
      BeneficialUseCv: beneficialUseFilter,
      VariableCv: variableTypeFilter,
      ReportingUnitTypeCv: "County"
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    await fetch("http://localhost:7071/api/GetWaterAggregationByFilterValues", requestOptions)
      .then(response => response.text())
      .then(result => {
        setAggregateData(JSON.parse(result));
      })
      .catch(error => console.log('error', error));
  }

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
        ReportingUnitTypeCv: "County"
      });

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

      await fetch("http://localhost:7071/api/GetWaterAggregationTimeSeries", requestOptions)
        .then(response => response.text())
        .then(result => {
          var data;
          data = JSON.parse(result);
          data = data.sort((a, b) => a.reportYearCv.localeCompare(b.reportYearCv));
          setTimeSeriesData(data);
        })
        .catch(error => console.log('error', error));
    }
  }

  return (
    <div className="map-content">
      <div className="row p-4">
        <div className="p-4 w-100">
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
            <label>Select Date</label>
            <DateSelect filterDateRange={setDateFilter} />
          </div>
        </div>
      </div>
      <div className="row min-vh-75">
        <div className="col-md-12">
          <div className='map-container' ref={mapContainerRef} />
        </div >
      </div >
      <div className="row min-vh-25 table-container">
        {
          timeSeriesData.length > 0 &&
          <table className="table table-striped table-dark m-5">
            <thead>
              <tr>
                <th scope="col">Aggregated Amount ID</th>
                <th scope="col">Amount (AF)</th>
                <th scope="col">Year</th>
                <th scope="col">UUID</th>
                <th scope="col">Name / Type</th>
                <th scope="col">State</th>
              </tr>
            </thead>
            <tbody>
              {timeSeriesData.map((t) => (
                <>
                  <tr key={t.aggregatedAmountId}>
                    <th scope="row">{t.aggregatedAmountId}</th>
                    <td>{t.amount}</td>
                    <td>{t.reportYearCv}</td>
                    <td>{t.reportingUnit.reportingUnitUuid}</td>
                    <td>{t.reportingUnit.reportingUnitName + " " + t.reportingUnit.reportingUnitTypeCv}</td>
                    <td>{t.reportingUnit.stateCv}</td>
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

export default AggregationMap;
