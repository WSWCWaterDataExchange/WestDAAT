import { useContext, useState } from "react";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import FlowRangeSlider from "./FlowRangeSlider";
import { MapContext } from "./MapProvider";
import Select, { MultiValue, StylesConfig } from 'react-select';
import chroma from "chroma-js";

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

  const { layers, setLayerVisibility } = useContext(MapContext);

  const handleBeneficialUseChange = (selectedOptions: MultiValue<BeneficialUseChangeOption>) => {
    layers.forEach(layer => {
      if (layer.layout) {
        const selectedLayers = selectedOptions.map(o => o.value);
        setLayerVisibility(layer.id, selectedLayers.includes(layer.id));
      }
    })
  };

  const layerOptions = layers.map(layer => ({
    value: layer.id,
    label: layer.friendlyName,
    color: layer.paint?.["circle-color"] as string
  }));

  const displayNone = () => ({
    display: 'none'
  });

  const layerOptionStyles: StylesConfig<BeneficialUseChangeOption, true> = {
    control: (styles) => ({
      ...styles, 
      backgroundColor: 'white', 
      color: 'black'
    }),
    dropdownIndicator: displayNone,
    placeholder:  displayNone,
    indicatorSeparator: displayNone,
    clearIndicator: (styles) => ({
      ...styles, 
      color: 'ced4da',
      ':hover': {
        color: 'ced4da'
      }
    }),
    multiValue: (styles, { data }) => {
      const color = chroma(data.color);
      return {
        ...styles,
        backgroundColor: color.darken().alpha(0.3).css(),
      };
    },
    multiValueLabel: (styles) => ({
      ...styles,
      color: 'black',
    }),
    multiValueRemove: (styles, { data }) => ({
      ...styles,
      color: data.color,
      ':hover': {
        backgroundColor: data.color,
        color: 'white',
      },
    }),
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
        <select className="form-select">
          <option>Beneficial Use</option>
        </select>
      </div>

      <div className="mb-3">
        <label>Search Location</label>
        <input type="text" className="form-control" />
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
        <Select
          onChange={handleBeneficialUseChange}
          closeMenuOnSelect={false}
          defaultValue={layerOptions}
          options={layerOptions}
          styles={layerOptionStyles}
          theme={(theme) => ({
            ...theme,
            colors: {
              ...theme.colors,
              neutral20: "#ced4da"
            }
          })}
          isMulti
        />
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
    </>
  );
}

export default WaterRightsTab;
