import React, { useCallback, useMemo } from 'react';
import Select, { MultiValue } from 'react-select';
import { useTimeSeriesContext } from '../../TimeSeriesProvider';

export function TimeSeriesWaterSourceTypeSelect() {
  const { waterSourceTypes, selectedWaterSourceTypes, setWaterSourceTypes } = useTimeSeriesContext();

  const handleChange = useCallback(
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
      <label htmlFor="time-series-water-source-type">Water Source Type</label>
      <Select
        id="time-series-water-source-type"
        isMulti
        options={options}
        onChange={handleChange}
        closeMenuOnSelect={false}
        placeholder="Select Water Source Type"
        value={selectedValues}
      />
    </div>
  );
}

export default TimeSeriesWaterSourceTypeSelect;
