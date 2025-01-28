import React from 'react';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
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

  const handleLatitudeChanged = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setPointData((s) => ({
        ...s,
        latitude: e.target.value,
      }));
    },
    [setPointData],
  );

  const handleLongitudeChanged = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setPointData((s) => ({
        ...s,
        longitude: e.target.value,
      }));
    },
    [setPointData],
  );

  const setLatLongData = useCallback(
    (latValue: string, longValue: string) => {
      let lat = parseFloat(latValue);
      let long = parseFloat(longValue);
      const pointLat = isNaN(lat) ? '' : lat.toFixed(nldi.latLongPrecision);
      const pointLong = isNaN(long) ? '' : long.toFixed(nldi.latLongPrecision);
      if (isNaN(lat) || isNaN(long)) {
        setPointData((s) => ({
          ...s,
          latitude: pointLat,
          longitude: pointLong,
        }));
        setLatLong(null, null);
        return;
      }
      if (lat > 90) {
        lat = 90;
      } else if (lat < -90) {
        lat = -90;
      }
      if (long > 180) {
        long = 180;
      } else if (long < -180) {
        long = -180;
      }
      lat = parseFloat(lat.toFixed(nldi.latLongPrecision));
      long = parseFloat(long.toFixed(nldi.latLongPrecision));
      setLatLong(lat, long);
      setPointData((s) => ({
        ...s,
        latitude: lat.toFixed(nldi.latLongPrecision),
        longitude: long.toFixed(nldi.latLongPrecision),
      }));
    },
    [setLatLong],
  );

  const handleLatitudeBlurred = () => {
    setLatLongData(pointData.latitude, pointData.longitude);
  };

  const handleLongitudeBlurred = () => {
    setLatLongData(pointData.latitude, pointData.longitude);
  };

  const handleDirectionsChanged = (e: ChangeEvent<HTMLInputElement>, dir: Directions) => {
    const val = e.target.checked ? nldiFilters.directions | dir : nldiFilters.directions & ~dir;
    setDirections(val);
  };

  const handleDataPointsChanged = (e: ChangeEvent<HTMLInputElement>, dataPoint: DataPoints) => {
    const val = e.target.checked ? nldiFilters.dataPoints | dataPoint : nldiFilters.dataPoints & ~dataPoint;
    setDataPoints(val);
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
          value={pointData.latitude ?? ''}
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
          value={pointData.longitude ?? ''}
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
            checked={(nldiFilters.directions & Directions.Upsteam) > 0}
            onChange={(e) => handleDirectionsChanged(e, Directions.Upsteam)}
            label="Upstream"
          />
        </Form.Group>
        <Form.Group>
          <Form.Check
            className="toggle"
            type="switch"
            id="nldiDownstream"
            checked={(nldiFilters.directions & Directions.Downsteam) > 0}
            onChange={(e) => handleDirectionsChanged(e, Directions.Downsteam)}
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
            id="nldiWade"
            checked={(nldiFilters.dataPoints & DataPoints.Wade) > 0}
            onChange={(e) => handleDataPointsChanged(e, DataPoints.Wade)}
            label="WaDE Sites"
          />
        </Form.Group>
        <Form.Group>
          <Form.Check
            className="toggle"
            type="switch"
            id="nldiUsgs"
            checked={(nldiFilters.dataPoints & DataPoints.Usgs) > 0}
            onChange={(e) => handleDataPointsChanged(e, DataPoints.Usgs)}
            label="USGS sites"
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

function NldiDragAndDropButton(props: { setLatLong: (lat: string, long: string) => void }) {
  const [{ dropResult, isDragging }, dragRef] = useDrag({
    type: 'nldiMapPoint',
    item: {},
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      dropResult: monitor.getDropResult<{ latitude: number; longitude: number } | undefined>(),
    }),
  });
  const { setLatLong } = props;
  useEffect(() => {
    if (dropResult) {
      setLatLong(dropResult.latitude.toString(), dropResult.longitude.toString());
    }
  }, [dropResult, setLatLong]);

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
        ref={(el) => {
          dragRef(el);
        }}
        variant="no-outline"
        className="grabbable me-2"
      >
        <Icon path={mdiMapMarker} color={nldi.colors.mapMarker} size="48px" />
      </Button>
      <span>Drag and drop the "Pin Icon" on the map to select your search location</span>
    </div>
  );
}
