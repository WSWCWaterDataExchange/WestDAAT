import { ChangeEvent, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Directions, DataPoints } from "../data-contracts/nldi";
import { MapContext } from "./MapProvider";
import { Button, Form } from "react-bootstrap";
import { mdiMapMarker } from '@mdi/js';
import { nldi } from '../config/constants';
import { useDrag } from 'react-dnd';
import { AppContext } from "../AppProvider";
import { useNldiFeatures } from "../hooks/useNldiQuery";
import { useMapErrorAlert } from "../hooks/useMapAlert";
import Icon from '@mdi/react';
import deepEqual from 'fast-deep-equal/es6';
import useProgressIndicator from "../hooks/useProgressIndicator";
import "../styles/NldiFilters.scss";

function NldiTab() {
  interface NldiDataType {
    latitude: number | null,
    longitude: number | null,
    directions: Directions,
    dataPoints: DataPoints
  }
  const defaultNldiData = useMemo(() => ({
    latitude: null as number | null,
    longitude: null as number | null,
    directions: Directions.Upsteam | Directions.Downsteam as Directions,
    dataPoints: DataPoints.Usgs | DataPoints.Epa | DataPoints.Wade as DataPoints
  }), [])
  const { setUrlParam, getUrlParam } = useContext(AppContext);
  const [nldiData, setNldiData] = useState(getUrlParam<NldiDataType>("nldi") ?? defaultNldiData);

  const [pointData, setPointData] = useState({
    latitude: nldiData.latitude?.toFixed(nldi.latLongPrecision) ?? "",
    longitude: nldiData.longitude?.toFixed(nldi.latLongPrecision) ?? ""
  });

  const handleLatitudeChanged = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setPointData(s => ({
      ...s,
      latitude: e.target.value
    }));
  }, [setPointData])

  const handleLongitudeChanged = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setPointData(s => ({
      ...s,
      longitude: e.target.value
    }));
  }, [setPointData])

  const setLatLongData = useCallback((latValue: string, longValue: string) => {
      let lat = parseFloat(latValue);
      let long = parseFloat(longValue);
      let pointLat = isNaN(lat) ? "" : lat.toFixed(nldi.latLongPrecision);
      let pointLong = isNaN(long) ? "" : long.toFixed(nldi.latLongPrecision);
      if (isNaN(lat) || isNaN(long)) {
        setPointData(s => ({
          ...s,
          latitude: pointLat,
          longitude: pointLong
        }));
        setNldiData(s => ({
          ...s,
          latitude: null,
          longitude: null
        }));
        return;
      }
      if (lat > 90) {
        lat = 90;
      } else if (lat < -90) {
        lat = -90
      }
      if (long > 180) {
        long = 180;
      } else if (long < -180) {
        long = -180
      }
      lat = parseFloat(lat.toFixed(nldi.latLongPrecision));
      long = parseFloat(long.toFixed(nldi.latLongPrecision));
      setNldiData(s => ({
        ...s,
        latitude: lat,
        longitude: long
      }));
      setPointData(s => ({
        ...s,
        latitude: lat.toFixed(nldi.latLongPrecision),
        longitude: long.toFixed(nldi.latLongPrecision)
      }));
  }, [])

  const handleLatitudeBlurred = () => {
    setLatLongData(pointData.latitude, pointData.longitude);
  }

  const handleLongitudeBlurred = () => {
    setLatLongData(pointData.latitude, pointData.longitude);
  }

  const handleDirectionsChanged = (e: ChangeEvent<HTMLInputElement>, dir: Directions) => {
    const val = e.target.checked ? nldiData.directions | dir : nldiData.directions & ~dir;
    setNldiData(s => ({
      ...s,
      directions: val
    }));
  }

  const handleDataPointsChanged = (e: ChangeEvent<HTMLInputElement>, dataPoint: DataPoints) => {
    const val = e.target.checked ? nldiData.dataPoints | dataPoint : nldiData.dataPoints & ~dataPoint;
    setNldiData(s => ({
      ...s,
      dataPoints: val
    }));
  }

  const { setGeoJsonData, setLayerFilters: setMapLayerFilters } = useContext(MapContext);
  const { data: nldiGeoJsonData, isFetching: isNldiDataFetching, isError: isNldiDataError } = useNldiFeatures(nldiData.latitude, nldiData.longitude);

  useProgressIndicator([!isNldiDataFetching], "Loading NLDI Data");

  useEffect(() => {
    if (nldiGeoJsonData) {
      setGeoJsonData('nldi', nldiGeoJsonData)
    }
  }, [nldiGeoJsonData, setGeoJsonData]);

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

    setMapLayerFilters([{
      layer: 'nldi-usgs-points',
      filter: ["all",
        ["==", ["get", "westdaat_featuredatatype"], "Point"],
        pointsTypeFilters,
        directionFilters
      ]
    }, {
      layer: 'nldi-flowlines',
      filter: ["all",
        ["==", ["get", "westdaat_featuredatatype"], "Flowline"],
        directionFilters
      ]
    }])
  }, [nldiData.dataPoints, nldiData.directions, setMapLayerFilters, directionNameKeys, directionNames, pointFeatureDataSourceNameKeys, pointFeatureDataSourceNames]);

  useEffect(() => {
    if (deepEqual(nldiData, defaultNldiData)) {
      setUrlParam("nldi", undefined);
    } else {
      setUrlParam("nldi", nldiData);
    }
  }, [nldiData, setUrlParam, defaultNldiData])

  useMapErrorAlert(isNldiDataError);

  return (
    <div className="position-relative flex-grow-1">
      <NldiDragAndDropButton setLatLong={setLatLongData} />
      <Form.Group className="mb-3">
        <Form.Label htmlFor="nldiLatitude">Latitude</Form.Label>
        <Form.Control id='nldiLatitude' type='number' placeholder="Enter Latitude" max={90} min={-90} step={.01} value={pointData.latitude ?? ''} onChange={handleLatitudeChanged} onBlur={handleLatitudeBlurred} />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label htmlFor="nldiLongitude">Longitude</Form.Label>
        <Form.Control id='nldiLongitude' type='number' placeholder="Enter Longitude" max={180} min={-180} step={.01} value={pointData.longitude ?? ''} onChange={handleLongitudeChanged} onBlur={handleLongitudeBlurred} />
      </Form.Group>
      <div className="mb-3">
        <label className="form-label fw-bolder">Direction</label>
        <Form.Group>
          <Form.Check className="toggle" type="switch" id="nldiUpstream" checked={(nldiData.directions & Directions.Upsteam) > 0} onChange={e => handleDirectionsChanged(e, Directions.Upsteam)} label="Upstream" />
        </Form.Group>
        <Form.Group>
          <Form.Check className="toggle" type="switch" id="nldiDownstream" checked={(nldiData.directions & Directions.Downsteam) > 0} onChange={e => handleDirectionsChanged(e, Directions.Downsteam)} label="Downstream" />
        </Form.Group>
      </div>
      <div className="mb-3">
        <label className="form-label fw-bolder">Scope of Query</label>
        <Form.Group>
          <Form.Check className="toggle" type="switch" id="nldiWade" checked={(nldiData.dataPoints & DataPoints.Wade) > 0} onChange={e => handleDataPointsChanged(e, DataPoints.Wade)} label="WaDE Sites" />
        </Form.Group>
        <Form.Group>
          <Form.Check className="toggle" type="switch" id="nldiUsgs" checked={(nldiData.dataPoints & DataPoints.Usgs) > 0} onChange={e => handleDataPointsChanged(e, DataPoints.Usgs)} label="USGS sites" />
        </Form.Group>
        <Form.Group>
          <Form.Check className="toggle" type="switch" id="nldiEpa" checked={(nldiData.dataPoints & DataPoints.Epa) > 0} onChange={e => handleDataPointsChanged(e, DataPoints.Epa)} label="EPA Sites" />
        </Form.Group>
      </div>
    </div >
  );
}

export default NldiTab;


function NldiDragAndDropButton(props: { setLatLong: (lat: string, long: string) => void }) {
  const [{ dropResult }, dragRef] = useDrag({
    type: 'nldiMapPoint',
    item: {},
    collect: monitor => ({
      isDragging: monitor.isDragging(),
      dropResult: monitor.getDropResult<{ latitude: number, longitude: number } | undefined>()
    })
  });
  const { setLatLong } = props;
  useEffect(() => {
    if (dropResult) {
      setLatLong(dropResult.latitude.toString(), dropResult.longitude.toString());
    }

  }, [dropResult, setLatLong])

  return (<div className="d-inline-flex flex-row align-items-center">
    <Button type="button" ref={dragRef} variant="no-outline" className="grabbable me-2" >
      <Icon path={mdiMapMarker} size="48px" />
    </Button>
    <span>Drag and drop pin on the map to select your search location</span>
  </div>
  );
}