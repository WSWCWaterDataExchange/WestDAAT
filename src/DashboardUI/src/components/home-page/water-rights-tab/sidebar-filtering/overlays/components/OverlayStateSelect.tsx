import React, { useCallback, useMemo } from 'react';
import Select, { MultiValue } from 'react-select';
import { useOverlaysContext } from '../../OverlaysProvider';

export function OverlayStateSelect() {
  const { states, selectedStates, setStates } = useOverlaysContext();

  const handleStateChange = useCallback(
    (values: MultiValue<{ value: string }>) => {
      const result = values.map((option) => option.value);
      setStates(result.length > 0 ? result : undefined);
    },
    [setStates],
  );

  const options = useMemo(() => {
    return states?.map((state) => ({ value: state, label: state })) ?? [];
  }, [states]);

  const selectedValues = useMemo(() => {
    return selectedStates?.map((state) => ({ value: state, label: state })) ?? [];
  }, [selectedStates]);

  return (
    <div className="mb-3">
      <label htmlFor="overlay-state-filter">State</label>
      <Select
        id="overlay-state-filter"
        isMulti
        options={options}
        onChange={handleStateChange}
        closeMenuOnSelect={false}
        placeholder="Select Overlay State(s)"
        value={selectedValues}
      />
    </div>
  );
}

export default OverlayStateSelect;
