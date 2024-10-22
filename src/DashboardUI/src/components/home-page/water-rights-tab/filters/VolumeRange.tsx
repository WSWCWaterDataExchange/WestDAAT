import React from 'react';
import { useDebounceCallback } from '@react-hook/debounce';
import NumericRange from '../../../NumericRange';
import { useVolumeFilters } from '../hooks/filters/useVolumeFilters';

const minControlProps = {
  placeholder: 'Min Volume',
  'aria-label': 'Minimum Volume Rate',
};

const maxControlProps = {
  placeholder: 'Max Volume',
  'aria-label': 'Maximum Volume Rate',
};
export function VolumeRange() {
  const { minValue, maxValue, setMinValue, setMaxValue } = useVolumeFilters();

  const handleVolumeChange = useDebounceCallback(
    (min: number | undefined, max: number | undefined) => {
      setMinValue(min);
      setMaxValue(max);
    },
    400,
  );

  return (
    <div className="mb-3">
      <label>Volume Range (AF)</label>
      <NumericRange
        initialMin={minValue}
        initialMax={maxValue}
        onChange={handleVolumeChange}
        units=""
        precision={1}
        minControlProps={minControlProps}
        maxControlProps={maxControlProps}
      />
    </div>
  );
}
