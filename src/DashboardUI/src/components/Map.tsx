import mapboxgl, { CircleLayer, NavigationControl, VectorSource } from "mapbox-gl";
import { useContext, useEffect, useRef, useState } from "react";

import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

import "../styles/map.scss";
import mapConfig from "../config/maps.json";
import { HomePageTab } from "../pages/HomePage";
import { AppContext, User } from "../AppProvider";

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

function Map(props: MapProps) {

  const [mapData, setMapData] = useState((mapConfig as any)[MapTypes.WaterRights] as MapData);

  const map = useRef<mapboxgl.Map | null>(null);
  const navControl = useRef(new NavigationControl());
  let geocoderControl = useRef(new MapboxGeocoder({
    accessToken: mapboxgl.accessToken
  }));

  const { user } = useContext(AppContext);

  useEffect(() => {
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESSTOKEN || "";
    map.current = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/light-v10",
      center: [-100, 40],
      zoom: 4,
    });

    updateMapControls(user);

    loadData(mapData);
  }, [mapData, user]);

  useEffect(() => {
    updateMapControls(user);
  }, [user]);


  useEffect(() => {
    // Swap maps out if user switches tabs
    let newMapType = props.currentTab === HomePageTab.WaterRights
      ? MapTypes.WaterRights
      : MapTypes.Aggregate;

    setMapData((mapConfig as any)[newMapType]);
  }, [props.currentTab]);

  const updateMapControls = (user: User | null) => {
    if (!map.current) return;

    if (map.current.hasControl(geocoderControl.current)) {
      map.current.removeControl(geocoderControl.current);
    }

    if (map.current.hasControl(navControl.current)) {
      map.current.removeControl(navControl.current);
    }

    // Only allow location search for logged in users
    if (user) {
      geocoderControl.current = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: map.current
      });
      map.current.addControl(geocoderControl.current);
    }

    map.current.addControl(navControl.current);
  }

  const loadData = (mapData: MapData) => {
    if (!map || !map.current) return;
    var myMap = map.current;

    myMap.on("load", function () {
      mapData.sources.forEach(s =>
        myMap.addSource(s.id, s.source)
      );

      mapData.layers.forEach(layer =>
        myMap.addLayer(layer)
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
