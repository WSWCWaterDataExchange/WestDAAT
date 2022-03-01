import mapboxgl from 'mapbox-gl';
import { useEffect, useState } from 'react';
import SidePanel from '../components/SidePanel';
import SiteFooter from '../components/SiteFooter';
import SiteNavbar from '../components/SiteNavbar';

import '../styles/home-page.scss';

export enum HomePageTab {
  WaterRights = "Water Rights",
  Aggregations = "Aggregations",
  SiteSpecific = "Site Specific"
}

function HomePage() {

  const [currentTab, setCurrentTab] = useState(HomePageTab.WaterRights);

  useEffect(() => {
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESSTOKEN || "";
    new mapboxgl.Map({
      container: 'map', // container ID
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: [-74.5, 40], // starting position [lng, lat]
      zoom: 9 // starting zoom
    });
  });

  const handleTabClick = (tab: HomePageTab) =>{
    setCurrentTab(tab);
  }

  return (
    <div className="home-page d-flex flex-column">
      <SiteNavbar onTabClick={handleTabClick} currentTab={currentTab} />
      <div className="d-flex flex-grow-1">
        <SidePanel currentTab={currentTab} />

        <div id="map" className="map flex-grow-1">
          <div className="legend mapboxgl-ctrl-bottom-right m-4">Legend</div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}

export default HomePage;
