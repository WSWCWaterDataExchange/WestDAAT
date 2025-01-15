import React, { useCallback, useMemo } from 'react';
import { useAllocationTypesFilter } from '../../../hooks/filters/useAllocationTypesFilter';
import { useWaterRightsContext } from '../../Provider';
import Select, { MultiValue } from 'react-select';

export function AllocationTypeSelect() {
  const { allocationTypes, setAllocationTypes } = useAllocationTypesFilter();

  const {
    hostData: {
      allocationTypesQuery: { data: allAllocationTypes },
    },
  } = useWaterRightsContext();

  const handleAllocationTypeChange = useCallback(
    (values: MultiValue<{ value: string }>) => {
      const result = values.map((option) => option.value);
      setAllocationTypes(result.length > 0 ? result : undefined);
    },
    [setAllocationTypes],
  );

  const options = useMemo(() => {
    return allAllocationTypes?.map((type) => ({ value: type }));
  }, [allAllocationTypes]);

  const selectedValues = useMemo(() => {
    return allocationTypes?.map((type) => ({ value: type })) ?? [];
  }, [allocationTypes]);

  return (
    <div className="mb-3">
      <label htmlFor="wr-allocation-types-filter">Allocation Type</label>
      <Select
        id="wr-allocation-types-filter"
        isMulti
        options={options}
        onChange={handleAllocationTypeChange}
        closeMenuOnSelect={false}
        placeholder="Select Allocation Type(s)"
        name="allocationTypes"
        getOptionLabel={(option) => option.value}
        value={selectedValues}
      />
    </div>
  );
}
