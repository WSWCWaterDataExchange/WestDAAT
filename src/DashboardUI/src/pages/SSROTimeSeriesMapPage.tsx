import React, { useRef, useEffect, useState } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import './map.css';

export default function Map() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const tokyo = { lng: 139.753, lat: 35.6844 };
  const [zoom] = useState(14);
  maptilersdk.config.apiKey = 'YOUR_MAPTILER_API_KEY_HERE';

  useEffect(() => {
    if (map.current) return; // stops map from initializing more than once

    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: maptilersdk.MapStyle.STREETS,
      center: [tokyo.lng, tokyo.lat],
      zoom: zoom
    });

  }, [tokyo.lng, tokyo.lat, zoom]);

  return (
    <div className="map-wrap">
      <div ref={mapContainer} className="map" />
    </div>
  );
}


// function SSROTimeSeriesMapPage() {
//   return <h1>Time Series Page</h1>;
// }

// export default SSROTimeSeriesMapPage;