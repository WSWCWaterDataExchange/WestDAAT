import { useContext, useState } from "react";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import FlowRangeSlider from "./FlowRangeSlider";
import { MapContext } from "./MapProvider";
import { MultiValue } from 'react-select';
import BeneficialUseSelect from "./BeneficialUseSelect";

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

  const { layers, setLayerVisibility, setVisibleMapLayersFilter } = useContext(MapContext);

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

    if(selectedOptions.length === 0) {
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
        <BeneficialUseSelect layers={layers} onChange={handleBeneficialUseChange} />
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
