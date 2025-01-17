import React from 'react';
import { useCallback, useMemo } from 'react';
import { MultiValue } from 'react-select';
import Select from 'react-select';
import { useWaterRightsContext } from '../../WaterRightsProvider';
import { useRiverBasinFilter } from "../hooks/useRiverBasinFilter";

export function RiverBasinSelect() {
  const { riverBasinNames, setRiverBasinNames } = useRiverBasinFilter();

  const {
    hostData: {
      riverBasinsQuery: { data: allRiverBasinOptions },
    },
  } = useWaterRightsContext();

  const handleRiverBasinChange = useCallback(
    (values: MultiValue<{ value: string }>) => {
      const result = values.map((option) => option.value);
      setRiverBasinNames(result.length > 0 ? result : undefined);
    },
    [setRiverBasinNames],
  );

  const options = useMemo(() => {
    return allRiverBasinOptions?.map((type) => ({ value: type }));
  }, [allRiverBasinOptions]);

  const selectedValues = useMemo(() => {
    return riverBasinNames?.map((type) => ({ value: type })) ?? [];
  }, [riverBasinNames]);

  return (
    <div className="mb-3">
      <label htmlFor="wr-river-basins-filter">River Basin Area</label>
      <Select
        id="wr-river-basins-filter"
        isMulti
        options={options}
        onChange={handleRiverBasinChange}
        closeMenuOnSelect={false}
        placeholder="Select Sites in River Basin(s)"
        name="riverBasins"
        getOptionLabel={(option) => option.value}
        value={selectedValues}
      />
    </div>
  );
}
