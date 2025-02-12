import React, { useCallback, useMemo } from 'react';
import Select, { MultiValue } from 'react-select';
import { useOverlaysContext } from '../../OverlaysProvider';

export function OverlayTypeSelect() {
  const { overlayTypes, selectedOverlayTypes, setSelectedOverlayTypes } = useOverlaysContext();

  const handleOverlayTypeChange = useCallback(
    (values: MultiValue<{ value: string }>) => {
      const selectedValues = values.map((option) => option.value);
      setSelectedOverlayTypes(selectedValues.length > 0 ? selectedValues : undefined);
    },
    [setSelectedOverlayTypes],
  );

  const options = useMemo(() => {
    return overlayTypes.map((type) => ({ value: type, label: type }));
  }, [overlayTypes]);

  const selectedValues = useMemo(() => {
    return selectedOverlayTypes ? selectedOverlayTypes.map((type) => ({ value: type, label: type })) : [];
  }, [selectedOverlayTypes]);

  return (
    <div className="mb-3">
      <label htmlFor="overlay-type-filter">Overlay Type</label>
      <Select
        id="overlay-type-filter"
        isMulti
        options={options}
        onChange={handleOverlayTypeChange}
        closeMenuOnSelect={false}
        placeholder="Select Overlay Type(s)"
        value={selectedValues}
      />
    </div>
  );
}

export default OverlayTypeSelect;
