import Select, { StylesConfig } from 'react-select';
import chroma from "chroma-js";

export interface BeneficialUseChangeOption {
  value: string; // layerId
  label: string;
  color: string | undefined;
}

interface BeneficialUseSelectProps {
  options: BeneficialUseChangeOption[];
  selectedOptions: BeneficialUseChangeOption[];
  onChange: (selectedOptions: BeneficialUseChangeOption[]) => void;
}

function BeneficialUseSelect(props: BeneficialUseSelectProps) {

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
      if(data.color){
        const color = chroma(data.color);
        return {
          ...styles,
          backgroundColor: color.darken().alpha(0.3).css(),
        };
      }
      return styles;
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

  return (
    <>
      <Select
        value={props.selectedOptions}
        isMulti
        onChange={a=>props.onChange([...a])}
        closeMenuOnSelect={false}
        options={props.options}
        styles={layerOptionStyles}
      />
    </>
  );
}

export default BeneficialUseSelect;
