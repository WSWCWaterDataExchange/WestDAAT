import { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "./TimeSeriesMap.scss";
import Icon from "@mdi/react";
import { mdiOpenInNew } from "@mdi/js";
import ReactDOM from "react-dom";
import { Card } from "react-bootstrap";
import CardHeader from "react-bootstrap/esm/CardHeader";
import Select from "react-select";
import MapLegend from "./MapLegend";

// import Select, { SelectChangeEvent } from "@mui/material/Select";
// import OutlinedInput from "@mui/material/OutlinedInput";
// import MenuItem from "@mui/material/MenuItem";

interface OptionType {
  label: string;
  value: string;
}

const siteNameArray: OptionType[] = [
  { label: "Canal / Ditch / Diversion", value: "Canal / Ditch / Diversion" },
  { label: "Reservoir/Dam", value: "Reservoir/Dam" },
  { label: "Site Specific Public Supply", value: "Site Specific Public Supply" },
  { label: "Stream Gage", value: "Stream Gage" },
  { label: "Surface Water Point", value: "Surface Water Point" },
  { label: "Water Right Related Withdrawal", value: "Water Right Related Withdrawal" },
  { label: "Well / Pump / Spring / Groundwater Point", value: "Well / Pump / Spring / Groundwater Point" },
  { label: "Unspecified", value: "Unspecified" },
];

const legendItems = [
  { name: "Canal / Ditch / Diversion", color: "#e47777" },
  { name: "Reservoir / Dam", color: "#ed1dca" },
  { name: "Site Specific Public Supply", color: "#d10000" },
  { name: "Stream Gage", color: "#9a6ce5" },
  { name: "Surface Water Point", color: "#79db75" },
  { name: "Water Right Related Withdrawal", color: "#FFD700" },
  { name: "Well / Pump / Spring / Groundwater", color: "#6f44d5" },
  { name: "Unspecified", color: "#49a0da" },
];

function TimeFullMap() {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapInstance, setMapInstance] = useState<mapboxgl.Map | null>(null);
  const [selectedWadeNameS, setSelectedWadeNameS] = useState<string | null>(null);
  const handleWadeNameSChange = (selectedOption: OptionType | null) => {
    setSelectedWadeNameS(selectedOption?.value || null);
  };
  // const [selectedWadeNameS, setSelectedWadeNameS] = useState<string[]>([]);
  // const handleWadeNameSChange = (event: SelectChangeEvent<typeof selectedWadeNameS>) => {
  //   const {
  //     target: { value },
  //   } = event;
  //   setSelectedWadeNameS(typeof value === "string" ? value.split(",") : value);
  // };

  useEffect(() => {
    mapboxgl.accessToken = mapboxgl.accessToken;
    const map = new mapboxgl.Map({
      container: "map",
      //style: "mapbox://styles/amabdallah/clpa0f7dx001901op5ihpfqev",
      style: "mapbox://styles/amabdallah/clua7068302hb01oif099hspo",
      center: [-110, 40],
      zoom: 5,
    });
    setMapInstance(map);

    map.on("load", async () => {
      setIsMapLoaded(true);

      // use third party tileset
      map.addSource("maptiler", {
        type: "vector",
        tiles: ["https://api.maptiler.com/tiles/d57c6c3e-9eed-4da6-bc87-13a5e7a0aeee/{z}/{x}/{y}.pbf?key=IauIQDaqjd29nJc5kJse"],
      });
      map.addLayer({
        id: "ss1",
        type: "circle",
        source: "maptiler",
        "source-layer": "points",
      });
      map.addLayer({
        id: "ss2",
        type: "fill",
        source: "maptiler",
        "source-layer": "polygons",
      });

      map.setPaintProperty("ss1", "circle-color", [
        "match",
        ["get", "WaDENameS"],
        "Canal / Ditch / Diversion",
        "#e47777",
        "Reservoir / Dam",
        "#ed1dca",
        "Site Specific Public Supply",
        "#d10000",
        "Stream Gage",
        "#9a6ce5",
        "Surface Water Point",
        "#79db75",
        "Water Right Related Withdrawal",
        "#FFD700",
        "Well / Pump / Spring / Groundwater",
        "#6f44d5",
        "Unspecified",
        "#49a0da",
        "#49a0da",
      ]);

      map.setPaintProperty("ss2", "fill-color", [
        "match",
        ["get", "WaDENameS"],
        "Canal / Ditch / Diversion",
        "#e47777",
        "Reservoir / Dam",
        "#ed1dca",
        "Site Specific Public Supply",
        "#d10000",
        "Stream Gage",
        "#9a6ce5",
        "Surface Water Point",
        "#79db75",
        "Water Right Related Withdrawal",
        "#FFD700",
        "Well / Pump / Spring / Groundwater",
        "#6f44d5",
        "Unspecified",
        "#49a0da",
        "#49a0da",
      ]);

      // create popup card for ss1 point layer
      map.on("click", "ss1", (e: mapboxgl.MapMouseEvent & mapboxgl.EventData) => {
        // Check if e.features is not undefined and contains at least one feature
        if (e.features && e.features.length > 0) {
          const feature = e.features[0];
          const properties = feature.properties;

          if (properties) {
            const popupContent = (
              <div>
                <Card className="popup-card">
                  <CardHeader className="popup-header">
                    <div>
                      Site ID:{" "}
                      <a href={`/details/timeSeriesPage/${properties.SiteUUID}`} target="_blank" rel="noopener noreferrer">
                        {properties.SiteUUID} <Icon path={mdiOpenInNew} className="map-popup-card-time-site-link-icon" />
                      </a>
                    </div>
                  </CardHeader>
                  <div className="popup-body">
                    <p>
                      <b>SiteNativeID:</b>
                      <br /> {properties.SiteNativeID}
                    </p>
                    <p>
                      <b>SiteName:</b>
                      <br /> {properties.SiteName}
                    </p>
                    <p>
                      <b>SiteTypeCV:</b>
                      <br /> {properties.SiteTypeCV}
                    </p>
                  </div>
                </Card>
              </div>
            );
            let coordinates = { lng: properties.Longitude, lat: properties.Latitude };
            const popupNode = document.createElement("div");
            ReactDOM.render(popupContent, popupNode);
            new mapboxgl.Popup().setLngLat(coordinates).setDOMContent(popupNode).addTo(map);
          }
        }
      });

      // create popup card for ss2 polygon layer
      map.on("click", "ss2", (e: mapboxgl.MapMouseEvent & mapboxgl.EventData) => {
        // Check if e.features is not undefined and contains at least one feature
        if (e.features && e.features.length > 0) {
          const feature = e.features[0];
          const properties = feature.properties;

          if (properties) {
            const popupContent = (
              <div>
                <Card className="popup-card">
                  <CardHeader className="popup-header">
                    <div>
                      Site ID:{" "}
                      <a href={`/details/timeSeriesPage/${properties.SiteUUID}`} target="_blank" rel="noopener noreferrer">
                        {properties.SiteUUID} <Icon path={mdiOpenInNew} className="map-popup-card-time-site-link-icon" />
                      </a>
                    </div>
                  </CardHeader>
                  <div className="popup-body">
                    <p>
                      <b>SiteNativeID:</b>
                      <br /> {properties.SiteNativeID}
                    </p>
                    <p>
                      <b>SiteName:</b>
                      <br /> {properties.SiteName}
                    </p>
                    <p>
                      <b>SiteTypeCV:</b>
                      <br /> {properties.SiteTypeCV}
                    </p>
                  </div>
                </Card>
              </div>
            );
            let coordinates = { lng: properties.Longitude, lat: properties.Latitude };
            const popupNode = document.createElement("div");
            ReactDOM.render(popupContent, popupNode);
            new mapboxgl.Popup().setLngLat(coordinates).setDOMContent(popupNode).addTo(map);
          }
        }
      });

      // Change the cursor to a pointer when the mouse is over the places layer.
      map.on("mouseenter", "ss1", () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseenter", "ss2", () => {
        map.getCanvas().style.cursor = "pointer";
      });

      // Change the cursor back to a pointer when it leaves.
      map.on("mouseleave", "ss1", () => {
        map.getCanvas().style.cursor = "";
      });
      map.on("mouseleave", "ss2", () => {
        map.getCanvas().style.cursor = "";
      });
    });

    return () => map.remove();
  }, []);

  useEffect(() => {
    if (mapInstance && isMapLoaded) {
      const wadeNameSFilter = selectedWadeNameS ? ["all", ["==", "WaDENameS", selectedWadeNameS]] : ["!=", "", ""]; // Show all points when no specific site type is selected
      const combinedFilter = ["all", wadeNameSFilter];
      // console.log(combinedFilter);
      mapInstance.setFilter("ss1", combinedFilter);
      mapInstance.setFilter("ss2", combinedFilter);

      // take a look at this, try & figure out setFilter() https://docs.mapbox.com/mapbox-gl-js/api/map/#map#setfilter
    }
  }, [isMapLoaded, selectedWadeNameS]);

  return (
    <div className="time-series-home-map">
      <div className="time-series-home-filter">
        <label>Select WaDE Site Type:</label>
        <Select options={[{ value: "", label: "All" }, ...siteNameArray]} value={{ label: selectedWadeNameS || "", value: selectedWadeNameS || "" }} onChange={handleWadeNameSChange} />
        {/* <Select multiple value={selectedWadeNameS} onChange={handleWadeNameSChange} input={<OutlinedInput label="Name" />}>
          {siteNameArray.map((name) => (
            <MenuItem key={name.value} value={name.value}>
              {name.label}
            </MenuItem>
          ))}
        </Select> */}
      </div>
      <div id="map" className="series-map" style={{ width: "100%", height: "90vh" }}></div>
      <MapLegend items={legendItems} />
    </div>
  );
}

export default TimeFullMap;
