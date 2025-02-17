import React, { useCallback, useMemo } from 'react';
import Select, { MultiValue } from 'react-select';
import { useTimeSeriesContext } from '../../TimeSeriesProvider';

export function TimeSeriesVariableTypeSelect() {
  const { variableTypes, selectedVariableTypes, setVariableTypes } = useTimeSeriesContext();

  const handleChange = useCallback(
    (values: MultiValue<{ value: string }>) => {
      const result = values.map((option) => option.value);
      setVariableTypes(result.length > 0 ? result : undefined);
    },
    [setVariableTypes],
  );

  const options = useMemo(() => {
    return variableTypes?.map((type) => ({ value: type, label: type })) ?? [];
  }, [variableTypes]);

  const selectedValues = useMemo(() => {
    return selectedVariableTypes?.map((type) => ({ value: type, label: type })) ?? [];
  }, [selectedVariableTypes]);

  return (
    <div className="mb-3">
      <label htmlFor="time-series-variable-type">Variable Type</label>
      <Select
        id="time-series-variable-type"
        isMulti
        options={options}
        onChange={handleChange}
        closeMenuOnSelect={false}
        placeholder="Select Variable Type"
        value={selectedValues}
      />
    </div>
  );
}

export default TimeSeriesVariableTypeSelect;
