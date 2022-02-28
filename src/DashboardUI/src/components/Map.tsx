import mapboxgl, { AnyLayer, AnySourceData, CircleLayer, NavigationControl, VectorSource } from "mapbox-gl";
import { useContext, useEffect, useState } from "react";

import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

import "../styles/map.scss";
import mapConfig from "../config/maps.json";
import { HomePageTab } from "../pages/HomePage";
import { AppContext } from "../App";

enum MapTypes {
  WaterRights = "waterRights",
  Aggregate = "aggregate",
}

interface MapData {
  sources: { id: string, source: VectorSource }[];
  layers: ({ legendValue: string } & CircleLayer)[];
}

interface MapProps {
  currentTab: HomePageTab;
}

let map: mapboxgl.Map | null = null;

let geocoderControl = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken
});

const navControl = new NavigationControl();


function Map(props: MapProps) {

  const [mapData, setMapData] = useState((mapConfig as any)[MapTypes.WaterRights] as MapData);

  const { user } = useContext(AppContext);

  useEffect(() => {
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESSTOKEN || "";
    map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/light-v10",
      center: [-100, 40],
      zoom: 4,
    });

    loadData(map);
  }, [mapData]);

  useEffect(() => {
    if (!map) return;

    if (map.hasControl(geocoderControl)) {
      map.removeControl(geocoderControl);
    }

    if (map.hasControl(navControl)) {
      map.removeControl(navControl);
    }

    // Only allow location search for logged in users
    if (user) {
      geocoderControl = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: map
      });
      map.addControl(geocoderControl);
    }

    map.addControl(navControl);

  }, [user]);


  useEffect(() => {
    // Swap maps out if user switches tabs
    let newMapType = props.currentTab === HomePageTab.WaterRights
      ? MapTypes.WaterRights
      : MapTypes.Aggregate;

    setMapData((mapConfig as any)[newMapType]);
  }, [props.currentTab]);

  const loadData = (map: mapboxgl.Map) => {
    map.on("load", function () {
      mapData.sources.forEach(s =>
        map.addSource(s.id, s.source)
      );

      mapData.layers.forEach(layer =>
        map.addLayer(layer)
      );
    });
  }

  return (
    <div className="position-relative h-100">
      <div className="legend">
        <div>
          {
            // Sort legend items alphabetically
            mapData.layers.sort((a, b) =>
              a.legendValue > b.legendValue ? 1 : -1
            ).map(layer => {
              // Null check for layer paint property
              let color = layer?.paint ? layer.paint["circle-color"] as string : "#000000";
              return (
                <div key={layer.id}>
                  <span style={{ "backgroundColor": color }}></span>
                  {layer.legendValue}
                </div>
              );
            }
            )
          }
        </div>
      </div>
      <div id="map" className="map h-100"></div>
    </div>
  );
}

export default Map;
