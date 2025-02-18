import React, { useCallback, useMemo } from 'react';
import Select, { MultiValue } from 'react-select';
import { useTimeSeriesContext } from '../../TimeSeriesProvider';

export function TimeSeriesPrimaryUseCategorySelect() {
  const { primaryUseCategories, selectedPrimaryUseCategories, setPrimaryUseCategories } = useTimeSeriesContext();

  const handleChange = useCallback(
    (values: MultiValue<{ value: string }>) => {
      const result = values.map((option) => option.value);
      setPrimaryUseCategories(result.length > 0 ? result : undefined);
    },
    [setPrimaryUseCategories],
  );

  const options = useMemo(() => {
    return primaryUseCategories?.map((type) => ({ value: type, label: type })) ?? [];
  }, [primaryUseCategories]);

  const selectedValues = useMemo(() => {
    return selectedPrimaryUseCategories?.map((type) => ({ value: type, label: type })) ?? [];
  }, [selectedPrimaryUseCategories]);

  return (
    <div className="mb-3">
      <label htmlFor="time-series-primary-use-category">Primary Use Category</label>
      <Select
        id="time-series-primary-use-category"
        isMulti
        options={options}
        onChange={handleChange}
        closeMenuOnSelect={false}
        placeholder="Select Primary Use Category"
        value={selectedValues}
      />
    </div>
  );
}

export default TimeSeriesPrimaryUseCategorySelect;
