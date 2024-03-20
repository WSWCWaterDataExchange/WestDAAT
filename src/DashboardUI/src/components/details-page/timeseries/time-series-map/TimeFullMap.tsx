import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "./TimeSeriesMap.scss";
import Icon from "@mdi/react";
import { mdiOpenInNew } from "@mdi/js";
import ReactDOM from "react-dom";
import { Card } from "react-bootstrap";
import CardHeader from "react-bootstrap/esm/CardHeader";
import Select from "react-select";
import MapLegend from "./MapLegend";

interface OptionType {
  label: string;
  value: string;
}

function TimeFullMap() {
  const [wadeNameSData, setWadeNameSData] = useState<Set<any>>(new Set());
  const [selectedWadeNameS, setSelectedWadeNameS] = useState<string | null>(null);

  const [mapInstance, setMapInstance] = useState<mapboxgl.Map | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const handleWadeNameSChange = (selectedOption: OptionType | null) => {
    setSelectedWadeNameS(selectedOption?.value || null);
  };

  useEffect(() => {
    mapboxgl.accessToken = mapboxgl.accessToken;
    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/amabdallah/clpa0f7dx001901op5ihpfqev",
      center: [-110, 40],
      zoom: 5,
    });
    setMapInstance(map);

    //ss1
    map.on("load", async () => {
      // Add a click event listener to the map
      setWadeNameSData(new Set());
      map?.queryRenderedFeatures({ layers: ["ss1"] } as any)?.forEach((feature: { properties: any }) => {
        const properties = feature.properties;

        if (properties) {
          setIsMapLoaded(true);
          setWadeNameSData((prevData) => new Set([...prevData, properties.WaDENameS]));
        }
      });

      map.on("click", "ss1", (e: mapboxgl.MapMouseEvent & mapboxgl.EventData) => {
        // Check if e.features is not undefined and contains at least one feature
        if (e.features && e.features.length > 0) {
          const feature = e.features[0];
          const properties = feature.properties;

          if (properties) {
            const coordinates = (feature.geometry as any).coordinates;

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

            const popupNode = document.createElement("div");
            ReactDOM.render(popupContent, popupNode);

            const popup = new mapboxgl.Popup().setLngLat(coordinates).setDOMContent(popupNode).addTo(map);
          }
        }
      });

      map.on("mouseenter", "ss1", () => {
        map.getCanvas().style.cursor = "pointer";
      });

      map.on("mouseleave", "ss1", () => {
        map.getCanvas().style.cursor = "";
      });
    });

    return () => map.remove();
  }, []);

  useEffect(() => {
    if (mapInstance && isMapLoaded) {
      // Check if a specific site type is selected
      const wadeNameSFilter = selectedWadeNameS ? ["all", ["==", "WaDENameS", selectedWadeNameS]] : ["!=", "", ""]; // Show all points when no specific site type is selected
      const combinedFilter = ["all", wadeNameSFilter];
      mapInstance.setFilter("ss1", combinedFilter);
    }
  }, [isMapLoaded, selectedWadeNameS]);

  const legendItems = [
    { name: "Water Right Related Withdrawal", color: "#FFD700" },
    { name: "Site Specific Public Supply", color: "#d10000" },
    { name: "Stream Gage", color: "#9a6ce5" },
    { name: "Surface Water Point", color: "#79db75" },
    { name: "Canal / Ditch", color: "#e47777" },
    { name: "Well / Pump / Spring / Groundwater", color: "#6f44d5" },
    { name: "Reservoir / Dam", color: "#ed1dca" },
    { name: "Unspecified", color: "#49a0da" },
  ];

  return (
    <div className="time-series-home-map">
      <div className="time-series-home-filter">
        <label>Select WaDE Site Type:</label>
        <Select
          onChange={handleWadeNameSChange}
          value={
            wadeNameSData.has(selectedWadeNameS)
              ? {
                  label: selectedWadeNameS || "",
                  value: selectedWadeNameS || "",
                }
              : null
          }
          options={[
            { value: "", label: "All" },
            ...Array.from(wadeNameSData).map((value) => ({
              value,
              label: value,
            })),
          ]}
        />
      </div>
      <div id="map" className="series-map" style={{ width: "100%", height: "90vh" }}></div>
      <MapLegend items={legendItems} />
    </div>
  );
}

export default TimeFullMap;
