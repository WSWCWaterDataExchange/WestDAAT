import { ChangeEvent, useEffect, useState } from "react";
import { Directions, DataPoints } from "../data-contracts/nldi";

function NldiTab() {
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
  useEffect(() => {
    if (nldiData.latitude != null && nldiData.longitude != null) {
      const e = new CustomEvent('nldiUpdated', { detail: nldiData });
      document.dispatchEvent(e);
    }
  }, [nldiData])
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
      return;
    }
    if (lat > 90) {
      lat = 90;
    } else if (lat < -90) {
      lat = -90
    }
    setNldiData({
      ...nldiData,
      latitude: lat
    });
    setPointData({
      ...pointData,
      latitude: lat.toFixed(6)
    });
  }
  const handleLongitudeBlurred = () => {
    let long = parseFloat(pointData.longitude);
    if (isNaN(long)) {
      setPointData({
        ...pointData,
        longitude: ""
      });
      return;
    }
    if (long > 180) {
      long = 180;
    } else if (long < -180) {
      long = -180
    }
    setNldiData({
      ...nldiData,
      longitude: long
    });
    setPointData({
      ...pointData,
      longitude: long.toFixed(6)
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
