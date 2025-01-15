import React from 'react';
import { useDebounceCallback } from '@react-hook/debounce';
import { DateRange } from '../../../../../DateRange';
import { usePriorityDateFilters } from '../../../hooks/filters/usePriorityDateFilters';

const minControlProps = {
  'aria-label': 'Minimum Priority Date',
};

const maxControlProps = {
  'aria-label': 'Maximum Priority Date',
};
export function PriorityDateRange() {
  const { minValue, maxValue, setMinValue, setMaxValue } = usePriorityDateFilters();

  const handlePriorityDateChange = useDebounceCallback((min: number | undefined, max: number | undefined) => {
    setMinValue(min);
    setMaxValue(max);
  }, 400);

  return (
    <div className="mb-3">
      <label>Priority Date</label>
      <DateRange
        onChange={handlePriorityDateChange}
        initialMin={minValue}
        initialMax={maxValue}
        minControlProps={minControlProps}
        maxControlProps={maxControlProps}
      />
    </div>
  );
}
