import Select, { MultiValue, StylesConfig } from 'react-select';
import chroma from "chroma-js";
import { Layer } from './MapProvider';

export interface BeneficialUseChangeOption {
  value: string; // layerId
  label: string;
  color: string;
}

interface BeneficialUseSelectProps {
  defaultValue: string[];
  layers: Layer[];
  onChange: (selectedOptions: MultiValue<BeneficialUseChangeOption>) => void;
}

function BeneficialUseSelect(props: BeneficialUseSelectProps) {

  const layerOptions = props.layers.map(layer => ({
    value: layer.id,
    label: layer.friendlyName,
    color: layer.paint?.["circle-color"] as string
  }));


  const displayNone = () => ({
    display: 'none'
  });

  // Can't use CSS, must use JS for these styles
  const layerOptionStyles: StylesConfig<BeneficialUseChangeOption, true> = {
    dropdownIndicator: (styles) => ({
      ...styles,
      color: "#3a4046",
      ":hover": {
        color: "#3a4046",
      },
    }),
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
    menu: (styles) => ({
      ...styles,
      zIndex: 10
    })
  };

  const selectedOptions: BeneficialUseChangeOption[] = layerOptions
    .filter(o => props.defaultValue.includes(o.value));

  return (
    <>
      {
        props.layers.length && (
          <Select
            defaultValue={selectedOptions}
            isMulti
            onChange={props.onChange}
            closeMenuOnSelect={false}
            options={layerOptions}
            styles={layerOptionStyles}
          />
        )
      }
    </>
  );
}

export default BeneficialUseSelect;
