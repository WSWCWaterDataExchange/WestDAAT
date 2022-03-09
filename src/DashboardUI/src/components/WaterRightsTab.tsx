import { useContext, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import FlowRangeSlider from "./FlowRangeSlider";
import { MapContext, MapStyle } from "./MapProvider";
import { MultiValue } from 'react-select';
import BeneficialUseSelect from "./BeneficialUseSelect";
import VolumeRangeSlider from "./VolumeRangeSlider";
import AllocationDateSlider from "./AllocationDateRangeSlider";
import mapConfig from "../config/maps.json";

interface BeneficialUseChangeOption {
  value: string,
  label: string,
  color: string
}

function WaterRightsTab() {
  const [radioValue, setRadioValue] = useState('1');
  const radios = [
    { name: 'Both', value: '1' },
    { name: 'POD', value: '2' },
    { name: 'POU', value: '3' },
  ];

  const {
    layers,
    setLayerVisibility,
    setVisibleMapLayersFilter,
    mapFilters,
    setCurrentMapStyle,
    setLegend,
    setCurrentSources,
    setCurrentLayers,
    clearMapFilters
  } = useContext(MapContext);

  const { mapStyle, visibleLayerIds } = mapFilters;

  useEffect(() => {
    setCurrentSources((mapConfig as any).waterRights.sources);
    setCurrentLayers((mapConfig as any).waterRights.layers);
  }, [setCurrentSources, setCurrentLayers])

  useEffect(() => {
    const mapData = (mapConfig as any).waterRights.layers;
    if (mapData) {
      setLegend(<div className="legend">
        <div>
          {
            //Sort legend items alphabetically
            mapData.sort((a: any, b: any) =>
              a.friendlyName > b.friendlyName ? 1 : -1
            ).map((layer: any) => {
              // Null check for layer paint property
              let color = layer?.paint ? layer.paint["circle-color"] as string : "#000000";
              return (
                <div key={layer.id}>
                  <span style={{ "backgroundColor": color }}></span>
                  {layer.friendlyName}
                </div>
              );
            }
            )
          }
        </div>
      </div>);
    }
  }, [setLegend])

  const handleBeneficialUseChange = (selectedOptions: MultiValue<BeneficialUseChangeOption>) => {
    let visibleLayerIds: string[] = [];
    layers.forEach(layer => {
      if (layer.layout) {
        const selectedLayers = selectedOptions.map(o => o.value);
        const isVisible = selectedLayers.includes(layer.id) || selectedOptions.length === 0;
        setLayerVisibility(layer.id, isVisible);
        if (isVisible) {
          visibleLayerIds.push(layer.id)
        }
      }
    });

    if (selectedOptions.length === 0) {
      visibleLayerIds = [];
    }

    // Persist filters in url
    setVisibleMapLayersFilter(visibleLayerIds);
  };

  return (
    <>
      <div className="mb-3">
        <label>FILTERS</label>
        <a href="/filters" target="_blank">Learn about WaDE filters</a>
      </div>

      <div className="mb-3">
        <label>TOGGLE VIEW</label>
        <ButtonGroup className="w-100">
          {radios.map((radio, idx) => (
            <ToggleButton
              key={idx}
              id={`radio-${idx}`}
              type="radio"
              variant="outline-primary"
              name="radio"
              value={radio.value}
              checked={radioValue === radio.value}
              onChange={(e) => setRadioValue(e.currentTarget.value)}
            >
              {radio.name}
            </ToggleButton>
          ))}
        </ButtonGroup>
      </div>

      <div className="mb-3">
        <label>Change Map Legend</label>
        <select className="form-select" onChange={(event) => console.log(event.target.value)}>
          <option>Beneficial Use</option>
          <option>Customer Type</option>
          <option>Site Type</option>
          <option>Water Source Type</option>
        </select>
      </div>

      <div className="mb-3">
        <label>Search Allocation Owner</label>
        <input type="text" className="form-control" />
      </div>

      <div className="mb-3">
        <label>Owner Classification</label>
        <select className="form-select">
        </select>
      </div>

      <div className="mb-3">
        <label>Beneficial Use</label>
        <BeneficialUseSelect defaultValue={visibleLayerIds} layers={layers} onChange={handleBeneficialUseChange} />
      </div>

      <div className="mb-3">
        <label>Water Source Type</label>
        <select className="form-select">
        </select>
      </div>

      <div className="mb-3 form-check form-switch">
        <input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault" />
        <label className="form-check-label">Include Empty Amount and Priority Date Value</label>
      </div>

      <div className="mb-3">
        <label>Flow Range</label>
        <span>- CFS to - CFS</span>
        <FlowRangeSlider handleChange={(values) => console.log(values)} />
      </div>

      <div className="mb-3">
        <label>Volume Range</label>
        <span>- AF to - AF</span>
        <VolumeRangeSlider handleChange={(values) => console.log(values)} />
      </div>

      <div className="mb-3">
        <label>Allocation Priority Date</label>
        <span>1850 to {new Date().getFullYear()}</span>
        <AllocationDateSlider handleChange={(values) => console.log(values)} />
      </div>

      <div className="mb-3">
        <label>MAP THEME</label>
        <div className="map-themes">
          {
            (() => {
              const isActive = (style: MapStyle) => style === mapStyle ? "active" : "";
              return <>
                <img onClick={() => setCurrentMapStyle(MapStyle.Light)} className={isActive(MapStyle.Light)} alt="light map" src="/map-themes/light.png" />
                <img onClick={() => setCurrentMapStyle(MapStyle.Dark)} className={isActive(MapStyle.Dark)} alt="dark map" src="/map-themes/dark.png" />
                <img onClick={() => setCurrentMapStyle(MapStyle.Street)} className={isActive(MapStyle.Street)} alt="streets map" src="/map-themes/streets.png" />
                <img onClick={() => setCurrentMapStyle(MapStyle.Outdoor)} className={isActive(MapStyle.Outdoor)} alt="outdoors map" src="/map-themes/outdoor.png" />
                <img onClick={() => setCurrentMapStyle(MapStyle.Satellite)} className={isActive(MapStyle.Satellite)} alt="satelite map" src="/map-themes/satelite.png" />
              </>
            })()
          }
        </div>
      </div>

      <div className="mt-4">
        <Button className="w-100" onClick={clearMapFilters}>
          Reset All Filters
        </Button>
      </div>
    </>
  );
}

export default WaterRightsTab;
