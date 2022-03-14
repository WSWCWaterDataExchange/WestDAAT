import { ChangeEvent, useCallback, useContext, useEffect, useState } from "react";
import { Directions, DataPoints } from "../data-contracts/nldi";
import { MapContext } from "./MapProvider";
import { getNldiFeatures } from "../accessors/nldiAccessor";
import { useQuery } from "react-query";
import { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import { Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { AppContext } from "../AppProvider";

function NldiTab() {
  const precision = 5;
  const { setUrlParam, getUrlParam } = useContext(AppContext);
  const [nldiData, setNldiData] = useState(getUrlParam<NldiData>("nldi") ?? {
    latitude: null as number | null,
    longitude: null as number | null,
    directions: Directions.Upsteam | Directions.Downsteam as Directions,
    dataPoints: DataPoints.Usgs | DataPoints.Epa | DataPoints.Wade as DataPoints
  });

  interface NldiData {
    latitude: number | null,
    longitude: number | null,
    directions: Directions,
    dataPoints: DataPoints
  }

  const [pointData, setPointData] = useState({
    latitude: nldiData.latitude?.toFixed(precision) ?? "",
    longitude: nldiData.longitude?.toFixed(precision) ?? ""
  });

  const retrieveNldiGeoJsonData = useCallback(async (): Promise<FeatureCollection<Geometry, GeoJsonProperties> | undefined> => {
    const promise = getNldiFeatures(nldiData.latitude ?? 0, nldiData.longitude ?? 0, Directions.Upsteam | Directions.Downsteam, DataPoints.Wade | DataPoints.Usgs | DataPoints.Epa);
    toast.promise(promise, {
      pending: 'Retrieving NLDI Data',
      error: 'Error Retrieving NLDI Data'
    })
    return promise;
  }, [])

  const handleLatitudeChanged = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setPointData(s=>({
      ...s,
      latitude: e.target.value
    }));
  }, [])

  const handleLongitudeChanged = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setPointData(s=>({
      ...s,
      longitude: e.target.value
    }));
  }, [])

  const handleLatitudeBlurred = useCallback(() => {
    let lat = parseFloat(pointData.latitude);
    if (isNaN(lat)) {
      setPointData(s=>({
        ...s,
        latitude: ""
      }));
      setNldiData(s=>({
        ...s,
        latitude: null
      }));
      return;
    }

    if (lat > 90) {
      lat = 90;
    } else if (lat < -90) {
      lat = -90
    }
    lat = parseFloat(lat.toFixed(precision));
    setNldiData(s=>({
      ...s,
      latitude: lat
    }));
    setPointData(s=>({
      ...s,
      latitude: lat.toFixed(precision)
    }));
  }, [])

  const handleLongitudeBlurred = useCallback(() => {
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
  }, [])

  const handleDirectionsChanged = useCallback((e: ChangeEvent<HTMLInputElement>, dir: Directions) => {
    const val = e.target.checked ? nldiData.directions | dir : nldiData.directions & ~dir;
    setNldiData(s=>({
      ...s,
      directions: val
    }));
  }, [])

  const handleDataPointsChanged = useCallback((e: ChangeEvent<HTMLInputElement>, dataPoint: DataPoints) => {
    const val = e.target.checked ? nldiData.dataPoints | dataPoint : nldiData.dataPoints & ~dataPoint;
    setNldiData(s=>({
      ...s,
      dataPoints: val
    }));
  }, [])

  const { setVisibleLayers, setLegend, setGeoJsonData, setLayerFilters: setMapLayerFilters } = useContext(MapContext);
  useEffect(() => {
    setVisibleLayers(['nldi-flowlines', 'nldi-usgs-points']);
    setLegend(null);
  }, [setLegend, setVisibleLayers]);

  const { data: nldiGeoJsonData } = useQuery(
    ['nldiGeoJsonData', nldiData.latitude, nldiData.longitude],
    retrieveNldiGeoJsonData,
    {
      enabled: !!nldiData.latitude && !!nldiData.longitude,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      cacheTime: 8600000,
      staleTime: Infinity,
    }
  );

  useEffect(() => {
    setGeoJsonData('nldi', nldiGeoJsonData ?? {
      "type": "FeatureCollection",
      "features": []
    })

  }, [nldiGeoJsonData, setGeoJsonData]);

  useEffect(() => {
    setUrlParam("nldi", nldiData);
  }, [nldiData, setUrlParam]);

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

    setMapLayerFilters([
      {
        layer: 'nldi-usgs-points', filter: ["any",
          ["all",
            ["==", ["get", "westdaat_featuredatatype"], "Point"],
            pointsTypeFilters,
            directionFilters
          ],
          ["==", ["get", "westdaat_pointdatasource"], "Location"]
        ]
      },
      {
        layer: 'nldi-flowlines', filter: ["all",
          ["==", ["get", "westdaat_featuredatatype"], "Flowline"],
          directionFilters
        ]
      }
    ])
  }, [nldiData.dataPoints, nldiData.directions, setMapLayerFilters]);

  return (
    <>
      <div className='row'>
        <div className='col-12'>
          <h1>NLDI Site Search Tool</h1>
        </div>
      </div>
      <Form.Group>
        <Form.Label htmlFor="nldiLatitude">Latitude</Form.Label>
        <Form.Control id='nldiLatitude' type='number' placeholder="Enter Latitude" max={90} min={-90} step={.01} value={pointData.latitude ?? ''} onChange={handleLatitudeChanged} onBlur={handleLatitudeBlurred} />
      </Form.Group>
      <Form.Group>
        <Form.Label htmlFor="nldiLongitude">Longitude</Form.Label>
        <Form.Control id='nldiLongitude' type='number' placeholder="Enter Longitude" max={180} min={-180} step={.01} value={pointData.longitude ?? ''} onChange={handleLongitudeChanged} onBlur={handleLongitudeBlurred} />
      </Form.Group>
      <div>
        Direction
        <Form.Group>
          <Form.Check id="nldiUpstream" checked={(nldiData.directions & Directions.Upsteam) > 0} onChange={e => handleDirectionsChanged(e, Directions.Upsteam)} label="Upstream" />
        </Form.Group>
        <Form.Group>
          <Form.Check id="nldiDownstream" checked={(nldiData.directions & Directions.Downsteam) > 0} onChange={e => handleDirectionsChanged(e, Directions.Downsteam)} label="Downstream" />
        </Form.Group>
      </div>
      <div>
        Data Type
        <Form.Group>
          <Form.Check id="nldiWade" checked={(nldiData.dataPoints & DataPoints.Wade) > 0} onChange={e => handleDataPointsChanged(e, DataPoints.Wade)} label="WaDE" />
        </Form.Group>
        <Form.Group>
          <Form.Check id="nldiUsgs" checked={(nldiData.dataPoints & DataPoints.Usgs) > 0} onChange={e => handleDataPointsChanged(e, DataPoints.Usgs)} label="USGS" />
        </Form.Group>
        <Form.Group>
          <Form.Check id="nldiEpa" checked={(nldiData.dataPoints & DataPoints.Epa) > 0} onChange={e => handleDataPointsChanged(e, DataPoints.Epa)} label="EPA" />
        </Form.Group>
      </div>
    </>
  );
}

export default NldiTab;
