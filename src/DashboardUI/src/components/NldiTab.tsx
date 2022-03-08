import { ChangeEvent, useContext, useEffect, useState } from "react";
import { Directions, DataPoints } from "../data-contracts/nldi";
import { MapContext } from "./MapProvider";
import mapConfig from "../config/maps.json";
import { AnySourceImpl, GeoJSONSource } from "mapbox-gl";
import { getNldiFeatures } from "../accessors/nldiAccessor";
import { useQuery } from "react-query";
import { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";

function NldiTab() {
  const precision = 5;
  const [nldiData, setNldiData] = useState({
    latitude: null as number | null,
    longitude: null as number | null,
    directions: Directions.Upsteam | Directions.Downsteam as Directions,
    dataPoints: DataPoints.Usgs | DataPoints.Epa | DataPoints.Wade as DataPoints
  });

  const [pointData, setPointData] = useState({
    latitude: "",
    longitude: ""
  });

  const retrieveNldiGeoJsonData = async (): Promise<FeatureCollection<Geometry, GeoJsonProperties> | undefined> => {
    return getNldiFeatures(nldiData.latitude ?? 0, nldiData.longitude ?? 0, Directions.Upsteam | Directions.Downsteam, DataPoints.Wade | DataPoints.Usgs | DataPoints.Epa);
  }

  const isGeoJsonSource = (mapSource: AnySourceImpl | undefined): mapSource is GeoJSONSource => {
    return (mapSource as GeoJSONSource)?.setData !== undefined;
  }

  const handleLatitudeChanged = (e: ChangeEvent<HTMLInputElement>) => {
    setPointData({
      ...pointData,
      latitude: e.target.value
    });
  }

  const handleLongitudeChanged = (e: ChangeEvent<HTMLInputElement>) => {
    setPointData({
      ...pointData,
      longitude: e.target.value
    });
  }

  const handleLatitudeBlurred = () => {
    let lat = parseFloat(pointData.latitude);
    if (isNaN(lat)) {
      setPointData({
        ...pointData,
        latitude: ""
      });
      setNldiData({
        ...nldiData,
        latitude: null
      });
      return;
    }

    if (lat > 90) {
      lat = 90;
    } else if (lat < -90) {
      lat = -90
    }
    lat = parseFloat(lat.toFixed(precision));
    setNldiData({
      ...nldiData,
      latitude: lat
    });
    setPointData({
      ...pointData,
      latitude: lat.toFixed(precision)
    });
  }

  const handleLongitudeBlurred = () => {
    let long = parseFloat(pointData.longitude);
    if (isNaN(long)) {
      setPointData({
        ...pointData,
        longitude: ""
      });
      setNldiData({
        ...nldiData,
        longitude: null
      });
      return;
    }
    if (long > 180) {
      long = 180;
    } else if (long < -180) {
      long = -180
    }
    long = parseFloat(long.toFixed(precision));
    setNldiData({
      ...nldiData,
      longitude: long
    });
    setPointData({
      ...pointData,
      longitude: long.toFixed(precision)
    });
  }

  const handleDirectionsChanged = (e: ChangeEvent<HTMLInputElement>, dir: Directions) => {
    const val = e.target.checked ? nldiData.directions | dir : nldiData.directions & ~dir;
    setNldiData({
      ...nldiData,
      directions: val
    });
  }

  const handleDataPointsChanged = (e: ChangeEvent<HTMLInputElement>, dataPoint: DataPoints) => {
    const val = e.target.checked ? nldiData.dataPoints | dataPoint : nldiData.dataPoints & ~dataPoint;
    setNldiData({
      ...nldiData,
      dataPoints: val
    });
  }

  const { map, layers, setCurrentSources, setCurrentLayers, setLegend } = useContext(MapContext);
  const { data: nldiGeoJsonData } = useQuery(
    ['nldiGeoJsonData', nldiData.latitude, nldiData.longitude],
    retrieveNldiGeoJsonData,
    {
      enabled: !!nldiData.latitude && !!nldiData.longitude,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      cacheTime: 8600000,
      staleTime: Infinity,
    }
  );

  useEffect(() => {
    const source = map?.getSource('nldi');
    if (isGeoJsonSource(source) && nldiGeoJsonData !== undefined) {
      source.setData(nldiGeoJsonData);
    }
  }, [nldiGeoJsonData, map]);

  useEffect(() => {
    setCurrentSources((mapConfig as any).tempNldi.sources);
    setCurrentLayers((mapConfig as any).tempNldi.layers);
    setLegend(null);
  }, [setCurrentSources, setCurrentLayers, setLegend]);

  useEffect(() => {
    let pointsTypeFilters: any[] = ["any"];
    if (nldiData.dataPoints & DataPoints.Wade) {
      pointsTypeFilters.push(["==", ["get", "westdaat_pointdatasource"], "Wade"])
    }
    if (nldiData.dataPoints & DataPoints.Usgs) {
      pointsTypeFilters.push(["==", ["get", "westdaat_pointdatasource"], "UsgsSurfaceWaterSite"])
    }
    if (nldiData.dataPoints & DataPoints.Epa) {
      pointsTypeFilters.push(["==", ["get", "westdaat_pointdatasource"], "EpaWaterQualitySite"])
    }

    let directionFilters: any[] = ["any"];
    if (nldiData.directions & Directions.Upsteam) {
      directionFilters.push(["==", ["get", "westdaat_direction"], "Upstream"])
    }
    if (nldiData.directions & Directions.Downsteam) {
      directionFilters.push(["==", ["get", "westdaat_direction"], "Downstream"])
    }

    let pointsLayer = map?.getLayer('nldi-usgs-points');
    if (pointsLayer) {
      map?.setFilter(pointsLayer.id,
        ["any",
          ["all",
            ["==", ["get", "westdaat_featuredatatype"], "Point"],
            pointsTypeFilters,
            directionFilters
          ],
          ["==", ["get", "westdaat_pointdatasource"], "Location"]
        ]);
    }
    let flowlinesLayer = map?.getLayer('nldi-flowlines');
    if (flowlinesLayer) {
      map?.setFilter(flowlinesLayer.id,
        ["all",
          ["==", ["get", "westdaat_featuredatatype"], "Flowline"],
          directionFilters
        ]);
    }
  }, [layers, map, nldiData.dataPoints, nldiData.directions]);

  return (
    <>
      <div className='row'>
        <div className='col-12'>
          <h1>NLDI Site Search Tool</h1>
        </div>
      </div>
      <div className="form-group">
        <label htmlFor='nldiLatitude'>Latitude</label>
        <input id='nldiLatitude' type='number' className="form-control" placeholder="Enter Latitude" max={90} min={-90} step={.001} value={pointData.latitude ?? ''} onChange={handleLatitudeChanged} onBlur={handleLatitudeBlurred} />
      </div>
      <div className="form-group">
        <label htmlFor='nldiLongitude'>Longitude</label>
        <input id='nldiLongitude' type='number' className="form-control" placeholder="Enter Longitude" max={180} min={-180} step={.001} value={pointData.longitude ?? ''} onChange={handleLongitudeChanged} onBlur={handleLongitudeBlurred} />
      </div>
      <div>
        Direction
        <div className="form-check">
          <input type="checkbox" className="form-check-input" id="nldiUpstream" checked={(nldiData.directions & Directions.Upsteam) > 0} onChange={e => handleDirectionsChanged(e, Directions.Upsteam)} />
          <label className="form-check-label" htmlFor="nldiUpstream">Upstream</label>
        </div>
        <div className="form-check">
          <input type="checkbox" className="form-check-input" id="nldiDownstream" checked={(nldiData.directions & Directions.Downsteam) > 0} onChange={e => handleDirectionsChanged(e, Directions.Downsteam)} />
          <label className="form-check-label" htmlFor="nldiDownstream">Downstream</label>
        </div>
      </div>
      <div>
        Data Type
        <div className="form-check">
          <input type="checkbox" className="form-check-input" id="nldiWade" checked={(nldiData.dataPoints & DataPoints.Wade) > 0} onChange={e => handleDataPointsChanged(e, DataPoints.Wade)} />
          <label className="form-check-label" htmlFor="nldiWade">WaDE</label>
        </div>
        <div className="form-check">
          <input type="checkbox" className="form-check-input" id="nldiUsgs" checked={(nldiData.dataPoints & DataPoints.Usgs) > 0} onChange={e => handleDataPointsChanged(e, DataPoints.Usgs)} />
          <label className="form-check-label" htmlFor="nldiUsgs">USGS</label>
        </div>
        <div className="form-check">
          <input type="checkbox" className="form-check-input" id="nldiEpa" checked={(nldiData.dataPoints & DataPoints.Epa) > 0} onChange={e => handleDataPointsChanged(e, DataPoints.Epa)} />
          <label className="form-check-label" htmlFor="nldiEpa">EPA</label>
        </div>
      </div>
    </>
  );
}

export default NldiTab;
