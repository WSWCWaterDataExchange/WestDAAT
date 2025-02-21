import React, { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { Directions, DataPoints } from '../../../../../../data-contracts/nldi';
import { Button, Form } from 'react-bootstrap';
import { mdiMapMarker } from '@mdi/js';
import { nldi } from '../../../../../../config/constants';
import { useDrag } from 'react-dnd';
import Icon from '@mdi/react';
import './nldi-filters.scss';
import { defaultNldiFilters } from '../../WaterRightsProvider';
import { useNldiFilter } from '../hooks/useNldiFilter';

export function NldiFilters() {
  const { nldiFilterData, setDataPoints, setDirections, setLatLong } = useNldiFilter();

  const nldiFilters = useMemo(() => {
    return nldiFilterData ?? defaultNldiFilters;
  }, [nldiFilterData]);

  const [pointData, setPointData] = useState({
    latitude: nldiFilters.latitude?.toFixed(nldi.latLongPrecision) ?? '',
    longitude: nldiFilters.longitude?.toFixed(nldi.latLongPrecision) ?? '',
  });

  const handleLatitudeChanged = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setPointData((prev) => ({
      ...prev,
      latitude: e.target.value,
    }));
  }, []);

  const handleLongitudeChanged = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setPointData((prev) => ({
      ...prev,
      longitude: e.target.value,
    }));
  }, []);

  const setLatLongData = useCallback(
    (latValue: string, longValue: string) => {
      let lat = parseFloat(latValue);
      let lng = parseFloat(longValue);

      const pointLat = isNaN(lat) ? '' : lat.toFixed(nldi.latLongPrecision);
      const pointLng = isNaN(lng) ? '' : lng.toFixed(nldi.latLongPrecision);

      if (isNaN(lat) || isNaN(lng)) {
        setPointData((prev) => ({
          ...prev,
          latitude: pointLat,
          longitude: pointLng,
        }));
        setLatLong(null, null);
        return;
      }

      if (lat > 90) lat = 90;
      else if (lat < -90) lat = -90;
      if (lng > 180) lng = 180;
      else if (lng < -180) lng = -180;

      lat = parseFloat(lat.toFixed(nldi.latLongPrecision));
      lng = parseFloat(lng.toFixed(nldi.latLongPrecision));

      setLatLong(lat, lng);

      setPointData((prev) => ({
        ...prev,
        latitude: lat.toFixed(nldi.latLongPrecision),
        longitude: lng.toFixed(nldi.latLongPrecision),
      }));
    },
    [setLatLong],
  );

  const handleLatitudeBlurred = useCallback(() => {
    setLatLongData(pointData.latitude, pointData.longitude);
  }, [pointData, setLatLongData]);

  const handleLongitudeBlurred = useCallback(() => {
    setLatLongData(pointData.latitude, pointData.longitude);
  }, [pointData, setLatLongData]);

  const handleDirectionsChanged = (e: ChangeEvent<HTMLInputElement>, dir: Directions) => {
    const newValue = e.target.checked ? nldiFilters.directions | dir : nldiFilters.directions & ~dir;
    setDirections(newValue);
  };

  const handleDataPointsChanged = (e: ChangeEvent<HTMLInputElement>, dataPoint: DataPoints) => {
    const newValue = e.target.checked ? nldiFilters.dataPoints | dataPoint : nldiFilters.dataPoints & ~dataPoint;
    setDataPoints(newValue);
  };

  return (
    <div className="position-relative flex-grow-1">
      <NldiDragAndDropButton setLatLong={setLatLongData} />

      <Form.Group className="mb-3">
        <Form.Label htmlFor="nldiLatitude">Latitude</Form.Label>
        <Form.Control
          id="nldiLatitude"
          type="number"
          placeholder="Enter Latitude"
          max={90}
          min={-90}
          step={0.01}
          value={pointData.latitude}
          onChange={handleLatitudeChanged}
          onBlur={handleLatitudeBlurred}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label htmlFor="nldiLongitude">Longitude</Form.Label>
        <Form.Control
          id="nldiLongitude"
          type="number"
          placeholder="Enter Longitude"
          max={180}
          min={-180}
          step={0.01}
          value={pointData.longitude}
          onChange={handleLongitudeChanged}
          onBlur={handleLongitudeBlurred}
        />
      </Form.Group>
      <div className="mb-3">
        <label className="form-label fw-bolder">Direction</label>
        <Form.Group>
          <Form.Check
            className="toggle"
            type="switch"
            id="nldiUpstream"
            checked={(nldiFilters.directions & Directions.Upstream) > 0}
            onChange={(e) => handleDirectionsChanged(e, Directions.Upstream)}
            label="Upstream"
          />
        </Form.Group>
        <Form.Group>
          <Form.Check
            className="toggle"
            type="switch"
            id="nldiDownstream"
            checked={(nldiFilters.directions & Directions.Downstream) > 0}
            onChange={(e) => handleDirectionsChanged(e, Directions.Downstream)}
            label="Downstream"
          />
        </Form.Group>
      </div>
      <div className="mb-3">
        <label className="form-label fw-bolder">Scope of Query</label>
        <Form.Group>
          <Form.Check
            className="toggle"
            type="switch"
            id="nldiWadeRights"
            checked={(nldiFilters.dataPoints & DataPoints.WadeRights) > 0}
            onChange={(e) => handleDataPointsChanged(e, DataPoints.WadeRights)}
            label="WaDE Rights"
          />
        </Form.Group>
        <Form.Group>
          <Form.Check
            className="toggle"
            type="switch"
            id="nldiWadeTimeseries"
            checked={(nldiFilters.dataPoints & DataPoints.WadeTimeseries) > 0}
            onChange={(e) => handleDataPointsChanged(e, DataPoints.WadeTimeseries)}
            label="WaDE Timeseries"
          />
        </Form.Group>

        <Form.Group>
          <Form.Check
            className="toggle"
            type="switch"
            id="nldiUsgs"
            checked={(nldiFilters.dataPoints & DataPoints.Usgs) > 0}
            onChange={(e) => handleDataPointsChanged(e, DataPoints.Usgs)}
            label="USGS Sites"
          />
        </Form.Group>
        <Form.Group>
          <Form.Check
            className="toggle"
            type="switch"
            id="nldiEpa"
            checked={(nldiFilters.dataPoints & DataPoints.Epa) > 0}
            onChange={(e) => handleDataPointsChanged(e, DataPoints.Epa)}
            label="EPA Sites"
          />
        </Form.Group>
      </div>
    </div>
  );
}
function NldiDragAndDropButton(props: { setLatLong: (lat: string, lng: string) => void }) {
  const { setLatLong } = props;
  const [{ isDragging }, dragRef] = useDrag({
    type: 'nldiMapPoint',
    item: {},
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<{ latitude: number; longitude: number }>();
      if (dropResult) {
        setLatLong(dropResult.latitude.toString(), dropResult.longitude.toString());
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  useEffect(() => {
    if (isDragging) {
      document.body.classList.add('dragging-nldi');
    } else {
      document.body.classList.remove('dragging-nldi');
    }
  }, [isDragging]);

  return (
    <div className="d-inline-flex flex-row align-items-center">
      <Button
        type="button"
        variant="no-outline"
        className="grabbable me-2"
        ref={(el) => {
          if (el) {
            dragRef(el);
          }
        }}
      >
        <Icon path={mdiMapMarker} color={nldi.colors.mapMarker} size="48px" />
      </Button>
      <span>Drag and drop the "Pin Icon" on the map to select your search location</span>
    </div>
  );
}
