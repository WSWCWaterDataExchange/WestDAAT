import React from 'react';
import { useDebounceCallback } from '@react-hook/debounce';
import { DateRange } from '../../../../../DateRange';
import { useTimeSeriesContext } from '../../TimeSeriesProvider';

const minControlProps = {
  'aria-label': 'Minimum Time Series Date',
};

const maxControlProps = {
  'aria-label': 'Maximum Time Series Date',
};

export function TimeSeriesDateRange() {
  const { minDate, maxDate, setMinDate, setMaxDate } = useTimeSeriesContext();

  const handleDateRangeChange = useDebounceCallback((min: number | undefined, max: number | undefined) => {
    setMinDate(min);
    setMaxDate(max);
  }, 400);

  return (
    <div className="mb-3">
      <label>Time Series Date Range</label>
      <DateRange
        onChange={handleDateRangeChange}
        initialMin={minDate}
        initialMax={maxDate}
        minControlProps={minControlProps}
        maxControlProps={maxControlProps}
      />
    </div>
  );
}

export default TimeSeriesDateRange;
