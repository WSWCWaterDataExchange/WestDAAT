import React from 'react';
import { useCallback, useMemo } from 'react';
import { MultiValue } from 'react-select';
import Select from 'react-select';
import { useStatesFilter } from "../hooks/useStatesFilter";
import { useWaterRightsContext } from '../../Provider';

export function StatesSelect() {
  const { states, setStates } = useStatesFilter();

  const {
    hostData: {
      statesQuery: { data: allStates },
    },
  } = useWaterRightsContext();

  const handleStateChange = useCallback(
    (values: MultiValue<{ value: string }>) => {
      const result = values.map((option) => option.value);
      setStates(result.length > 0 ? result : undefined);
    },
    [setStates],
  );

  const options = useMemo(() => {
    return allStates?.map((state) => ({ value: state }));
  }, [allStates]);

  const selectedValues = useMemo(() => {
    return states?.map((state) => ({ value: state })) ?? [];
  }, [states]);

  return (
    <div className="mb-3">
      <label htmlFor="wr-states-filter">State</label>
      <Select
        id="wr-states-filter"
        isMulti
        options={options}
        onChange={handleStateChange}
        closeMenuOnSelect={false}
        placeholder="Select State(s)"
        name="states"
        getOptionLabel={(option) => option.value}
        value={selectedValues}
      />
    </div>
  );
}
