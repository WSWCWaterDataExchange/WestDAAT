import React from 'react';
import { useDebounceCallback } from '@react-hook/debounce';
import NumericRange from '../../../NumericRange';
import { useFlowFilters } from '../hooks/filters/useFlowFilters';

const minControlProps = {
  placeholder: 'Min Flow',
  'aria-label': 'Minimum Flow Rate',
};

const maxControlProps = {
  placeholder: 'Max Flow',
  'aria-label': 'Maximum Flow Rate,
};
export function FlowRange() {
  const { minValue, maxValue, setMinValue, setMaxValue } = useFlowFilters();

  const handleFlowChange = useDebounceCallback(
    (min: number | undefined, max: number | undefined) => {
      setMinValue(min);
      setMaxValue(max);
    },
    400
  );

  return (
    <div className="mb-3">
      <label>Flow Range (CFS)</label>
      <NumericRange
        initialMin={minValue}
        initialMax={maxValue}
        onChange={handleFlowChange}
        units=""
        precision={2}
        minControlProps={minControlProps}
        maxControlProps={maxControlProps}
      />
    </div>
  );
}
