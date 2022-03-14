import { ChangeEvent, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Directions, DataPoints } from "../data-contracts/nldi";
import { MapContext } from "./MapProvider";
import { getNldiFeatures } from "../accessors/nldiAccessor";
import { useQuery } from "react-query";
import { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import { Form } from "react-bootstrap";
import { toast } from "react-toastify";
import Icon from '@mdi/react';
import { AppContext } from "../AppProvider";
import { mdiMapMarker, mdiRhombus, mdiCircleOutline, mdiCircle } from '@mdi/js';
import { nldi } from '../config/constants';

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
  }, [nldiData.latitude, nldiData.longitude])

  const handleLatitudeChanged = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setPointData(s => ({
      ...s,
      latitude: e.target.value
    }));
  }, [])

  const handleLongitudeChanged = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setPointData(s => ({
      ...s,
      longitude: e.target.value
    }));
  }, [])

  const handleLatitudeBlurred = useCallback(() => {
    let lat = parseFloat(pointData.latitude);
    if (isNaN(lat)) {
      setPointData(s => ({
        ...s,
        latitude: ""
      }));
      setNldiData(s => ({
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
    setNldiData(s => ({
      ...s,
      latitude: lat
    }));
    setPointData(s => ({
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
    setNldiData(s => ({
      ...s,
      directions: val
    }));
  }, [])

  const handleDataPointsChanged = useCallback((e: ChangeEvent<HTMLInputElement>, dataPoint: DataPoints) => {
    const val = e.target.checked ? nldiData.dataPoints | dataPoint : nldiData.dataPoints & ~dataPoint;
    setNldiData(s => ({
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
    setLegend(<div className="legend legend-nldi">
      <div>
        <span>
          <Icon path={mdiMapMarker} size="14px" style={{ color: nldi.colors.mapMarker }} />
        </span>
        Starting Point of Interest
      </div>
      <div>
        <span>
          <span style={{ backgroundColor: nldi.colors.mainstem, height: "4px" }} />
        </span>
        Mainstem
      </div>
      <div>
        <span>
          <span style={{ backgroundColor: nldi.colors.tributaries, height: "2px" }} />
        </span>
        Tributaries
      </div>
      <div>
        <span>
          <Icon path={mdiCircle} size="14px" style={{ color: nldi.colors.wade }} />
        </span>
        WaDE Sites
      </div>
      <div>
        <span>
          <Icon path={nldi.useSymbols ? mdiRhombus : mdiCircle} size="14px" style={{ color: nldi.colors.usgs }} />
        </span>
        USGS NWIS Sites
      </div>
      <div>
        <span>
          <Icon path={nldi.useSymbols ? mdiCircleOutline : mdiCircle} size="14px" style={{ color: nldi.colors.epa }} />
        </span>
        EPA Water Quality Portal<br /> Sites OSM Standard
      </div>
    </div>);
  }, [setLegend])

  const pointFeatureDataSourceNameKeys = useMemo(() => [DataPoints.Wade, DataPoints.Usgs, DataPoints.Epa] as const, []);
  const pointFeatureDataSourceNames: Record<DataPoints, string> = useMemo(() => ({
    [DataPoints.Wade]: "Wade",
    [DataPoints.Usgs]: "UsgsSurfaceWaterSite",
    [DataPoints.Epa]: "EpaWaterQualitySite"
  }), []);

  const directionNameKeys = useMemo(() => [Directions.Upsteam, Directions.Downsteam] as const, []);
  const directionNames: Record<Directions, string> = useMemo(() => ({
    [Directions.Upsteam]: "Upstream",
    [Directions.Downsteam]: "Downstream"
  }), [])

  useEffect(() => {
    let pointsTypeFilters: any[] = ["any"];
    for (const key of pointFeatureDataSourceNameKeys) {
      if (nldiData.dataPoints & key) {
        pointsTypeFilters.push(["==", ["get", "westdaat_pointdatasource"], pointFeatureDataSourceNames[key]])
      }
    }

    let directionFilters: any[] = ["any"];
    for (const key of directionNameKeys) {
      if (nldiData.directions & key) {
        directionFilters.push(["==", ["get", "westdaat_direction"], directionNames[key]])
      }
    }

    setMapLayerFilters([
      {
        layer: 'nldi-usgs-points', filter: ["any",
          ["all",
            ["==", ["get", "westdaat_featuredatatype"], "Point"],
            pointsTypeFilters,
            directionFilters
          ]
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