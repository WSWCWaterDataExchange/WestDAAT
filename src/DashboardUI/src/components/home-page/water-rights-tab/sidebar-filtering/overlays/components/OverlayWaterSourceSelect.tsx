import React, { useCallback, useMemo } from 'react';
import Select, { MultiValue } from 'react-select';
import { useOverlaysContext } from '../../OverlaysProvider';

export function OverlayWaterSourceSelect() {
  const { waterSourceTypes, selectedWaterSourceTypes, setWaterSourceTypes } = useOverlaysContext();

  const handleWaterSourceChange = useCallback(
    (values: MultiValue<{ value: string }>) => {
      const result = values.map((option) => option.value);
      setWaterSourceTypes(result.length > 0 ? result : undefined);
    },
    [setWaterSourceTypes],
  );

  const options = useMemo(() => {
    return waterSourceTypes?.map((type) => ({ value: type, label: type })) ?? [];
  }, [waterSourceTypes]);

  const selectedValues = useMemo(() => {
    return selectedWaterSourceTypes?.map((type) => ({ value: type, label: type })) ?? [];
  }, [selectedWaterSourceTypes]);

  return (
    <div className="mb-3">
      <label htmlFor="overlay-water-source-filter">Water Source Type</label>
      <Select
        id="overlay-water-source-filter"
        isMulti
        options={options}
        onChange={handleWaterSourceChange}
        closeMenuOnSelect={false}
        placeholder="Select Water Source Type(s)"
        value={selectedValues}
      />
    </div>
  );
}

export default OverlayWaterSourceSelect;
