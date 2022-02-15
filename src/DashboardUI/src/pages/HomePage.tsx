import mapboxgl from 'mapbox-gl';
import { useEffect } from 'react';

function HomePage() {

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiYW1hYmRhbGxhaCIsImEiOiJjazJnbno5ZHIwazVqM21xZzMwaWpsc2hqIn0.j6BmkJdp5O_9ITGm4Gwe0w';
    new mapboxgl.Map({
      container: 'map', // container ID
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: [-74.5, 40], // starting position [lng, lat]
      zoom: 9 // starting zoom
    });
  });

  return (
    <>
      <h1>
        Home Page
      </h1>
      {/* Just a placeholder for now to test mapbox package */}
      <div id="map" style={{width: 500, height: 500}}></div>
    </>
  );
}

export default HomePage;
