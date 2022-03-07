import { useContext, useState } from "react";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import FlowRangeSlider from "./FlowRangeSlider";
import { MapContext } from "./MapProvider";
import Select, { MultiValue, StylesConfig } from 'react-select';
import chroma from "chroma-js";

export interface BeneficialUseChangeOption {
  value: string; // layerId
  label: string;
  color: string;
}

function BeneficialUseSelect() {
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
    dropdownIndicator: displayNone,
    placeholder: displayNone,
    indicatorSeparator: displayNone,
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
    <Select
      onChange={handleBeneficialUseChange}
      closeMenuOnSelect={false}
      defaultValue={layerOptions}
      options={layerOptions}
      styles={layerOptionStyles}
      isMulti
    />
  );
}

export default BeneficialUseSelect;
