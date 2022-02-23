import mapboxgl from 'mapbox-gl';
import { useEffect } from 'react';
import SidePanel from '../components/SidePanel';
import SiteFooter from '../components/SiteFooter';
import SiteNavbar from '../components/SiteNavbar';

import '../styles/home-page.scss';

function HomePage() {

  useEffect(() => {
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESSTOKEN || "";
    new mapboxgl.Map({
      container: 'map', // container ID
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: [-74.5, 40], // starting position [lng, lat]
      zoom: 9 // starting zoom
    });
  });

  return (
    <div className="home-page">
      <SiteNavbar />
      <div className="main-container d-flex">
        <SidePanel />

        {/* Just a placeholder for now to test mapbox package */}
        <div id="map" className="w-100 h-100">
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}

export default HomePage;
