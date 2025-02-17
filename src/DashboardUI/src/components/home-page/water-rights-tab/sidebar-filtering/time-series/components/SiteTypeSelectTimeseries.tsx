import React, { useCallback, useMemo } from 'react';
import Select, { MultiValue } from 'react-select';
import { useTimeSeriesContext } from '../../TimeSeriesProvider';

export function TimeSeriesSiteTypeSelect() {
  const { siteTypes, selectedSiteTypes, setSiteTypes } = useTimeSeriesContext();

  const handleSiteTypeChange = useCallback(
    (values: MultiValue<{ value: string }>) => {
      const result = values.map((option) => option.value);
      setSiteTypes(result.length > 0 ? result : undefined);
    },
    [setSiteTypes],
  );

  const options = useMemo(() => {
    return siteTypes?.map((type) => ({ value: type, label: type })) ?? [];
  }, [siteTypes]);

  const selectedValues = useMemo(() => {
    return selectedSiteTypes?.map((type) => ({ value: type, label: type })) ?? [];
  }, [selectedSiteTypes]);

  return (
    <div className="mb-3">
      <label htmlFor="time-series-site-type-filter">Site Type</label>
      <Select
        id="time-series-site-type-filter"
        isMulti
        options={options}
        onChange={handleSiteTypeChange}
        closeMenuOnSelect={false}
        placeholder="Select Time Series Site Type(s)"
        name="timeSeriesSiteTypes"
        getOptionLabel={(option) => option.label}
        value={selectedValues}
      />
    </div>
  );
}

export default TimeSeriesSiteTypeSelect;
