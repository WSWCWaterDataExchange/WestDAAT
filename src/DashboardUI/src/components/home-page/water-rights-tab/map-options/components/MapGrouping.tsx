import Select from 'react-select';
import { MapGroupingClass as MG } from './MapGroupingClass';
import { useMapGroupingDisplayOption } from '../hooks/useMapGroupingDisplayOption';

const mapColorLegendOptions = [
  { value: MG.BeneficialUse, label: 'Beneficial Use' },
  { value: MG.OwnerClassification, label: 'Owner Classification' },
  { value: MG.WaterSourceType, label: 'Water Source Type' },
];

export function MapGrouping() {
  const { mapGrouping, setMapGrouping } = useMapGroupingDisplayOption();

  const handleMapGroupingChange = (mapGroupingOption: MG | undefined) => {
    setMapGrouping(mapGroupingOption);
  };

  return (
    <div className="mb-3">
      <label>Change Map Color Legend</label>
      <Select
        options={mapColorLegendOptions}
        onChange={(a) => handleMapGroupingChange(a?.value)}
        name="mapColorLegend"
        value={mapColorLegendOptions.find((x) => x.value === mapGrouping)}
      />
    </div>
  );
}

export default MapGrouping;
