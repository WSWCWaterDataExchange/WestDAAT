import React from 'react';
import { TimeSeriesSiteTypeSelect } from './SiteTypeSelectTimeseries';
import TimeSeriesDateRange from './TimeSeriesDateRange';

export function TimeSeriesFilter() {
  return (
    <div className="position-relative flex-grow-1">
      <TimeSeriesSiteTypeSelect />
      <TimeSeriesDateRange />
    </div>
  );
}

export default TimeSeriesFilter;
